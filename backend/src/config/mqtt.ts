import mqtt from "mqtt";


const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";


export const mqttClient = mqtt.connect(MQTT_URL, {

    clientId: `avitrack-server-${Date.now()}`,

    clean: true,

    reconnectPeriod: 5000

});


mqttClient.on("connect", () => {

    console.log("✅ Connecté au broker MQTT");

});


mqttClient.on("error", (error)=>{

    console.error("❌ Erreur MQTT :", error.message);

});


mqttClient.on("reconnect", ()=>{

    console.log("🔄 Reconnexion MQTT...");

});