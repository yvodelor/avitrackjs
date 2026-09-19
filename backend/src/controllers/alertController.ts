import { alertService } from "../services/alertService";
import { pool } from "../config/db";
import { createBaseController } from "./baseController";

const validateCreate = async (data: any) => {
  const result = await pool.query(
    `
    SELECT 1
    FROM alert
    WHERE categorie_id = $1
      AND type_mesure_id = $2
      AND $3 <= age_max
      AND $4 >= age_min
    LIMIT 1
    `,
    [
      data.categorie_id,
      data.type_mesure_id,
      data.age_min,
      data.age_max
    ]
  );

  if (result.rows.length > 0) {
    return "La tranche d’âge chevauche une tranche existante";
  }

  return null;
};

const validateUpdate = async (data: any) => {
  const result = await pool.query(
    `
    SELECT 1
    FROM alert
    WHERE categorie_id = $1
      AND type_mesure_id = $2
      AND id <> $3
      AND $4 <= age_max
      AND $5 >= age_min
    LIMIT 1
    `,
    [
      data.categorie_id,
      data.type_mesure_id,
      data.id,
      data.age_min,
      data.age_max
    ]
  );
  console.log('validateUpdate', result)
  if (result.rows.length > 0) {
    return "La tranche d’âge chevauche une tranche existante";
  }

  return null;
};


const getAlertMessages = async (
  req: any,
  res: any
) => {
  try {

    const { mesures } = req.body;

    if (!Array.isArray(mesures)) {
      return res.status(400).json({
        message: "Le champ mesures doit être un tableau"
      });
    }

    const result =
      await alertService.getAlertMessages(mesures);

    return res.json(result);

  } catch (error) {

    console.error(
      "Erreur récupération alertes :",
      error
    );

    return res.status(500).json({
      message:
        "Erreur lors de la récupération des alertes"
    });
  }
};


export const alertController = {
  ...createBaseController(
    alertService,
    {
      create: validateCreate,
      update: validateUpdate
    }
  ),

  getAlertMessages
};
