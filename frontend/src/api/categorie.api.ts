import { createCrudApi  } from "../api/crud.api";

export type Categorie = {
  id: string;
  name: string;
};


export const categorieApi = createCrudApi<Categorie>('/categorie');