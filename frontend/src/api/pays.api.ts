import { createCrudApi  } from "../api/crud.api";

export type Pays = {
  id: string;
  code: string
  nom: string
};

export const paysApi = createCrudApi<Pays>('/pays');