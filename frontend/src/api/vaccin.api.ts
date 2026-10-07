import { createCrudApi  } from "../api/crud.api";

export type Vaccin = {
  id: string;
  name: string;
  categorie_id: string;
  souche_id: string | null;
  age_min: string;
  age_max: string;
  remarque?: string;
  optional?: boolean
};


export const vaccinApi = createCrudApi<Vaccin>('/vaccin');