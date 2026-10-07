import { createCrudApi  } from "../api/crud.api";

export type MessageAlert = {
  id: string;
  type_alert_id: string;
  type_mesure_id: string;
  msg: string;
};


export const messageAlertApi = createCrudApi<MessageAlert>('/message-alert');