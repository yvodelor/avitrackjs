import { Request, Response } from "express";
import {pool} from "../config/db";

export const mesureController = {
  getByDevice: async (req: Request, res: Response) => {
    try {
      const { deviceCode } = req.params;

      if (!deviceCode) {
        return res.status(400).json({
          message: "Le code du device est obligatoire",
        });
      }

      const result = await pool.query(
        `
        SELECT
          id,
          type_mesure_id,
          val,
          date,
          device_code
        FROM (
          SELECT
            id,
            type_mesure_id,
            val,
            date,
            device_code,
            ROW_NUMBER() OVER (
              PARTITION BY type_mesure_id
              ORDER BY date DESC
            ) AS rn
          FROM mesure
          WHERE device_code = $1
        ) m
        WHERE rn <= 50
        ORDER BY type_mesure_id, date ASC
        `,
        [deviceCode]
      );

      console.log('result', result.rows[0])

      return res.status(200).json(result.rows);

    } catch (error) {
      console.error("Erreur récupération mesures :", error);

      return res.status(500).json({
        message: "Erreur lors de la récupération des mesures",
      });
    }
  },

  
};
