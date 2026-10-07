import { pool } from "../config/db";
import { createBaseService } from "./baseService";

type Pays = {
    id: number;
    nom: string;
    code: string;
   
};

export const paysService = {
    ...createBaseService<Pays>(
        pool,
        "pays",
        ["id", "nom"]
    ),
};