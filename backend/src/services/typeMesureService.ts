import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type TypeMesure = {
  id: number,
  code: string,
}

export const typeMesureService = {
  ...createBaseService<TypeMesure>(
  pool,
  "type_mesure",
  ["id"]
 
)}