
import { createCrudApi  } from "../api/crud.api";

export type Farm = {
  id: string;

  name: string
  pays_id: string
  ville_id: string
  
  adresse: string
};


export const farmApi = createCrudApi<Farm>('/farm');