import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Capteur = {
  id: number,
  name: string,
}

export const capteurService = {
  ...createBaseService<Capteur>(
  pool,
  "capteur",
  ["id", "name"]
 
)}