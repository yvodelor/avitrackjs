import { createCrudApi  } from "../api/crud.api";

export type TypeMesure = {
  id: string;
  name:string;
  code: string;
  couleur: string;

};

export const typeMesureApi = createCrudApi<TypeMesure>('/type-mesure');