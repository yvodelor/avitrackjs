import { createCrudApi  } from "../api/crud.api";

export type Alert = {
  id: string;
  categorie_id: string;
  souche_id?: string | null;
  type_mesure_id: string;
  age_min: string;
  age_max: string;
  val_min: string;
  val_max: string;
  val_limit: string;
  message: string,
  message_warning: string,
  message_danger: string

};


export const alertApi = createCrudApi<Alert>('/alert');