import { createCrudApi  } from "../api/crud.api";

export type Module = {
  id: string;
  name: string;
};


export const moduleApi = createCrudApi<Module>('/module');