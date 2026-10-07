import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Souche = {
  id: number,
  name: string,
  categorie_id: string
}

export const soucheService = {
  ...createBaseService<Souche>(
  pool,
  "souche",
  ["id"]
 
)}