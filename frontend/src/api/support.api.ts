
import { createCrudApi  } from "../api/crud.api";

export type Support = {
  id: string;
  building_id: string;
  type: string
  subject: string
  description: string
  status?: string

};


export const supportApi = createCrudApi<Support>('/support');