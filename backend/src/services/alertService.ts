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


interface ReponseAlert {
  type_mesure_id: number;
  valeur: number;
  niveau: "normal" | "warning" | "danger";
  message?: string;
  alert?: Alert;
}

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
): Promise<ReponseAlert | null> {

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

  console.log("alert", alertResult.rows);

  if (alertResult.rows.length === 0) {
    return null;
  }

  const alert = alertResult.rows[0];

  const valMin =
    alert.val_min !== null
      ? Number(alert.val_min)
      : null;

  const valMax =
    alert.val_max !== null
      ? Number(alert.val_max)
      : null;

  const valLimit = Number(alert.val_limit ?? 0);

  let niveau: "normal" | "warning" | "danger" = "normal";
  let messageAlert = alert.message ?? "";

  // ==========================================
  // DANGER MINIMUM
  // ==========================================
  if (
    valMin !== null &&
    valeurActu < valMin - valLimit
  ) {
    niveau = "danger";
    messageAlert = alert.message_danger ?? "";
  }

  // ==========================================
  // WARNING MINIMUM
  // ==========================================
  else if (
    valMin !== null &&
    valeurActu < valMin &&
    valeurActu >= valMin - valLimit
  ) {
    niveau = "warning";
    messageAlert = alert.message_warning ?? "";
  }

  // ==========================================
  // NORMAL
  // ==========================================
  else if (
    (valMin === null || valeurActu >= valMin) &&
    (valMax === null || valeurActu <= valMax)
  ) {
    niveau = "normal";
    messageAlert = alert.message ?? "";
  }

  // ==========================================
  // WARNING MAXIMUM
  // ==========================================
  else if (
    valMax !== null &&
    valeurActu > valMax &&
    valeurActu <= valMax + valLimit
  ) {
    niveau = "warning";
    messageAlert = alert.message_warning ?? "";
  }

  // ==========================================
  // DANGER MAXIMUM
  // ==========================================
  else if (
    valMax !== null &&
    valeurActu > valMax + valLimit
  ) {
    niveau = "danger";
    messageAlert = alert.message_danger ?? "";
  }

  console.log("valeur :", valeurActu);
  console.log("niveau :", niveau);
  console.log("message :", messageAlert);

  return {
    type_mesure_id: typeMesureId,
    valeur: valeurActu,
    niveau,
    message: messageAlert,
    alert,
  };
},

  
async getAlertMessages(
  mesures: {
    type_mesure_id: number;
    valeur: number;
    souche_id?: number | null;
    categorie_id: number;
    age: number;
  }[]
): Promise<ReponseAlert[]> {

  const results: ReponseAlert[] = [];

  for (const mesure of mesures) {
    const result = await this.getAlertMessage(
      Number(mesure.valeur),
      Number(mesure.type_mesure_id),
      Number(mesure.categorie_id),
      mesure.souche_id != null
        ? Number(mesure.souche_id)
        : null,
      Number(mesure.age)
    );

    if (result !== null) {
      results.push(result);
    }
  }

  console.log("résultat :", results);

  return results;
}
 
};