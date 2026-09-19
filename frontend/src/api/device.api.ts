import { createCrudApi  } from "../api/crud.api";

export type Device = {
  id: string;
  building_id: string;
  code: string;
  status: string;
  module_id:string

};


export const deviceApi = createCrudApi<Device>('/device');