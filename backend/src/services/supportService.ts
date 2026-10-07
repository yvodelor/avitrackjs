import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Support = {
  id: number,
  subject: string,
  description: string
  building_id:string
  type: string

}

export const supportService = {
  ...createBaseService<Support>(
  pool,
  "Support",
  ["id"]
 
)}