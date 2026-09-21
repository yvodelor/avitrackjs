import { pool } from "../config/db";
import { createBaseService } from "./baseService";

type Alert = {
  id: number;
  categorie_id: number;
  souche_id: number | null;
  type_mesure_id: number;
  age_min: number | null;
  age_max: number | null;
  val_min: number | null;
  val_max: number | null;
  val_limit: number | null;
  message: string | "";
  message_warning: string | "";
  message_danger: string | "";
};


type ReponseAlert = {
  valeur: number;
  niveau:string
  alert: Alert;
  message: string
}

type typeMesure = [
  {
    id: 1,
    code:'temperatue'
  },
  {
    id: 2,
    code:'humidity'
  },
  {
    id: 3,
    code:'ammociac'
  },
  {
    id: 4,
    code:'poids'
  }
]


export const alertService = {
  ...createBaseService<Alert>(
    pool,
    "alert",
    ["id"]
  ),

  async getAlertMessage(
    valeurActu: number,
    typeMesureId: number,
    categorieId: number,
    soucheId: number | null,
    age: number
  ) : Promise<ReponseAlert| null>{
    const alertResult = await pool.query(
      `
      SELECT *
      FROM alert
      WHERE type_mesure_id = $1
        AND categorie_id = $2
        AND (
          souche_id = $3
          OR souche_id IS NULL
        )
        AND (
          age_min IS NULL
          OR $4 >= age_min
        )
        AND (
          age_max IS NULL
          OR $4 <= age_max
        )
      ORDER BY
        CASE
          WHEN souche_id = $3 THEN 1
          ELSE 2
        END
      LIMIT 1
      `,
      [
        typeMesureId,
        categorieId,
        soucheId,
        age,
      ]
    );
    
    console.log('alert', alertResult.rows)

    if (alertResult.rows.length === 0) {
      return null;
    }

    const alert = alertResult.rows[0];
    console.log('al', alert)

    const valMin = Number(alert.val_min);
    const valMax = Number(alert.val_max);
    const valLimit = Number(alert.val_limit ?? 0);

    let niveau = "normal";
    let typeAlertIndice = 0;
    let typeAlertId = 1;

    let messageAlert = alert.message ?? "";

    // ==========================================
    // DANGER MINIMUM
    // ==========================================
    if (
      alert.val_min !== null &&
      valeurActu < valMin - valLimit
    ) {
      typeAlertCode = "danger";
      typeAlertIndice = -2;
      typeAlertId = 3;
      messageAlert = alert.message_danger ?? "";
    }

    // ==========================================
    // WARNING MINIMUM
    // ==========================================
    else if (
      alert.val_min !== null &&
      valeurActu < valMin &&
      valeurActu >= valMin - valLimit
    ) {
      niveau = "warning";
      typeAlertIndice = -1;
      typeAlertId = 2;
      messageAlert = alert.message_warning ?? "";
    }

    // ==========================================
    // NORMAL
    // ==========================================
    else if (
      (alert.val_min === null || valeurActu >= valMin) &&
      (alert.val_max === null || valeurActu <= valMax)
    ) {
      niveau = "normal";
      typeAlertIndice = 0;
      typeAlertId = 1;
      messageAlert = alert.message ?? "";
    }

    // ==========================================
    // WARNING MAXIMUM
    // ==========================================
    else if (
      alert.val_max !== null &&
      valeurActu > valMax &&
      valeurActu <= valMax + valLimit
    ) {
      niveau = "warning";
      typeAlertIndice = 1;
      typeAlertId = 2;
      messageAlert = alert.message_warning ?? "";
    }

    // ==========================================
    // DANGER MAXIMUM
    // ==========================================
    else if (
      alert.val_max !== null &&
      valeurActu > valMax + valLimit
    ) {
      niveau = "danger";
      typeAlertIndice = 2;
      typeAlertId = 3;
      messageAlert = alert.message_danger ?? "";
    }
    console.log('valeur', valeurActu)
    console.log('message', messageAlert)

    return {
      valeur: valeurActu,
      niveau: niveau,
      message: messageAlert,
      alert: alert
    }

  },

  
  async getAlertMessages(
    mesures: {
      type_mesure_id: number;
      valeur: number;
      souche_id?: number | null;
      categorie_id: number;
      age: number;
    }[]
  ): Promise<ReponseAlert[]>{
    const results: ReponseAlert[] = [];

    for (const mesure of mesures) {
      const result = await this.getAlertMessage(
        Number(mesure.valeur),
        Number(mesure.type_mesure_id),
        Number(mesure.categorie_id),
        mesure.souche_id
          ? Number(mesure.souche_id)
          : null,
        Number(mesure.age)
      );

      if( result !== null) results[Number(mesure.type_mesure_id)] = result
    }
    
     console.log('resultat', results)
    return results;
  },

 
};