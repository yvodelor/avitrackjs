import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Categorie = {
  id: number,
  name: string,
}

export const categorieService = {
  ...createBaseService<Categorie>(
  pool,
  "categorie",
  ["id", "name"]
 
)}