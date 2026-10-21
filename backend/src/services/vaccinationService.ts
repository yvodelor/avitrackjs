import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type Vaccination = {
  id: number;
  vaccin_id: number;
  building_id: string;
  date: Date;
  vaccins: string;
  remarque: string;
}

export const vaccinationService = {
  ...createBaseService<Vaccination>(
  pool,
  "vaccination",
  ["id", "vaccins", "building_id", "vaccin_id"],
    {
    joins:[
          ` JOIN building  ON vaccination.building_id = building.id  `,
          ` JOIN farms  ON building.farm_id = farms.id  `,
          ` JOIN users  ON farms.user_id = users.id  `,
           
        ],
    field:"farms.user_id"
  }
 
)}