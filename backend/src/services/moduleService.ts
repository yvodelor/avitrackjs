import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Module = {
  id: number,
  name: string,
}

export const moduleService = {
  ...createBaseService<Module>(
  pool,
  "module",
  ["id", "name"]
 
)}