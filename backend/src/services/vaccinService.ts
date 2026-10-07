import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Vaccin = {
  id: number;
  name: string;
  categorie_id: string;
  souche_id: string;
  age_min: number;
  age_max: number;
  remarque: string;
  optional: boolean
}

export const vaccinService = {
  ...createBaseService<Vaccin>(
  pool,
  "vaccin",
  ["id"]
 
)}