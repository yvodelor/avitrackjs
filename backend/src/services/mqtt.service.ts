import { mqttClient } from "../config/mqtt";
import { pool } from "../config/db";
import { io } from "../config/socket";


export class MQTTService {

    static subscribe(topic:string){
        mqttClient.subscribe(topic, (error)=>{
          if(error){
            console.error(
                "Erreur abonnement MQTT",
                error
            );

            return;
          }

          console.log(
              `Abonné au topic ${topic}`
          );

        });

    }

    static listen() {
      mqttClient.on("message", async (topic, message) => {
        try {
          // ==============================
          // 1. Conversion et parsing JSON
          // ==============================
          let payload: any;

          try {
            payload = JSON.parse(message.toString());
          } catch (error) {
            console.error(
              "❌ Payload JSON invalide :",
              message.toString()
            );
            return;
          }

          console.log("📩 Message MQTT reçu");
          console.log("Topic :", topic);
          console.log("Données :", payload);

          // ==============================
          // 2. Vérification du payload
          // ==============================
          if (
            typeof payload !== "object" ||
            payload === null ||
            Array.isArray(payload)
          ) {
            console.error("❌ Payload invalide :", payload);
            return;
          }

          // ==============================
          // 3. Vérification du device_id
          // ==============================
          if (
            typeof payload.device_id !== "string" ||
            payload.device_id.trim() === ""
          ) {
            console.error("❌ device_id invalide :", payload.device_id);
            return;
          }

          // ==============================
          // 4. Vérification du device
          // ==============================
          const resDevice = await pool.query(
            `SELECT * FROM device WHERE code = $1`,
            [payload.device_id]
          );

          if (resDevice.rows.length === 0) {
            console.error(
              `❌ Device inconnu : ${payload.device_id}`
            );
            return;
          }

          const device = resDevice.rows[0];

          console.log("✅ Device trouvé :", device);

          // ==============================
          // 5. Date
          // ==============================
          const date = new Date().toISOString();

          // ==============================
          // 6. Conversion des mesures
          // ==============================
          const valMesures = [
            {
              type_mesure_id: 1,
              valeur: Number(payload.t ?? 0)
            },
            {
              type_mesure_id: 2,
              valeur: Number(payload.h ?? 0)
            },
            {
              type_mesure_id: 3,
              valeur: Number(payload.a ?? 0)
            },
            {
              type_mesure_id: 4,
              valeur: Number(payload.p ?? 0)
            }
          ];

          // ==============================
          // 7. Vérification des nombres
          // ==============================
          if (
            valMesures.some(
              (m) => !Number.isFinite(m.valeur)
            )
          ) {
            console.error(
              "❌ Une ou plusieurs mesures sont invalides :",
              valMesures
            );
            return;
          }

          // ==============================
          // 8. Préparation INSERT
          // ==============================
          const values: any[] = [];

          const placeholders = valMesures
            .map((m, i) => {
              const idx = i * 4;

              values.push(
                payload.device_id,
                date,
                m.type_mesure_id,
                m.valeur
              );

              return `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`;
            })
            .join(", ");

          // ==============================
          // 9. Insertion PostgreSQL
          // ==============================
          const query = `
            INSERT INTO mesure
              (device_code, date, type_mesure_id, val)
            VALUES ${placeholders}
            RETURNING id, device_code, type_mesure_id, val
          `;

          const res = await pool.query(query, values);

          console.log(
            "✅ Mesures enregistrées :",
            res.rows
          );

          // ==============================
          // 10. Notification Socket.IO
          // ==============================
          io.to(`building-${device.building_id}`).emit(
            "sensor-data",
            {
              topic,
              data: {
                device_id: payload.device_id,
                temperature: Number(payload.t ?? 0),
                humidity: Number(payload.h ?? 0),
                acceleration: Number(payload.a ?? 0),
                pressure: Number(payload.p ?? 0),
                date
              }
            }
          );

        } catch (error) {
          console.error(
            "❌ Erreur traitement message MQTT :",
            error
          );
        }
      });
    }




    static publish(
        topic:string,
        data:any
    ){

        mqttClient.publish(
            topic,
            JSON.stringify(data)
        );

    }

}