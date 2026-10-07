import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Building = {
  id: number,
  farm_id: string,  
  name: string,
  capacity:string,
  souche_id:string,
  date_initial: string
}

export const buildingService = {
  ...createBaseService<Building>(
  pool,
  "building",
  ["id", "name", 'farm_id'],
  {
    joins:[
          ` JOIN farms  ON building.farm_id = farms.id  `,
          ` JOIN users  ON farms.user_id = users.id  `,
           
        ],
    field:"farms.user_id"
  }
 
)}