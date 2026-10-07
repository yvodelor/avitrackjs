import { createCrudApi  } from "./crud.api";

export type Intervention = {
  id: string;
  
  date_visite: string;
  symptomes: string;
  diagnostic: string;
  traitement: string;
  observation: string;
  support_id?: string

};


export const interventionApi = createCrudApi<Intervention>('/intervention');