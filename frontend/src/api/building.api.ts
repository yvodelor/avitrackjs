import { createCrudApi  } from "../api/crud.api";

export type Building = {
  id: string;
  name: string;
  farm_id: string;
  date_initial: string;
  souche_id: string;
  capacity: string;
  type: string;

};


export const buildingApi = createCrudApi<Building>('/building');