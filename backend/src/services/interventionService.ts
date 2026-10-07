import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Intervention = {
  id: number,
  diagnostic: string,
  symptomes: string
  traitement:string
  observation: string

}

export const interventionService = {
  ...createBaseService<Intervention>(
  pool,
  "intervention",
  ["id"]
 
)}