import { createCrudApi  } from "../api/crud.api";

export type Souche = {
  id: string;
  name: string;
  categorie_id: string;
};


export const soucheApi = createCrudApi<Souche>('/souche');