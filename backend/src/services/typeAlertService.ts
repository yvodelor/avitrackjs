import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type TypeAlert = {
  id: number,
  code: string,
}

export const typeAlertService = {
  ...createBaseService<TypeAlert>(
  pool,
  "type_alert",
  ["id"]
 
)}