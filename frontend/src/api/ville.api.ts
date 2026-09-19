import { createCrudApi  } from "./crud.api";

export type Ville = {
  id: string;
  nom: string;
  pays_id: string
};


export const villeApi = createCrudApi<Ville>('/ville');