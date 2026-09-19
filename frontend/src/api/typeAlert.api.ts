import { createCrudApi  } from "../api/crud.api";

export type TypeAlert = {
  id: string;
  code: string;
  couleur: string;


};


export const typeAlertApi = createCrudApi<TypeAlert>('/type-alert');