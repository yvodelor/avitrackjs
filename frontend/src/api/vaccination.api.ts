import { createCrudApi  } from "../api/crud.api";

export type Vaccination = {
  id: string;
  building_id: string;
  date: string;
  vaccins: string;
  remarque: string;
};


export const vaccinationApi = createCrudApi<Vaccination>('/vaccination');