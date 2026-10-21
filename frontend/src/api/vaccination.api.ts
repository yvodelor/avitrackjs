import { createCrudApi  } from "../api/crud.api";

export type Vaccination = {
  id: string;
  vaccin_id: number;
  building_id: string;
  date: string;
  vaccins: string;
  remarque: string;
};


export const vaccinationApi = createCrudApi<Vaccination>('/vaccination');