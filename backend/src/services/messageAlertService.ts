import {pool} from "../config/db";
import { createBaseService } from "./baseService";


type MessageAlert = {
  id: number,
  type_alert_id: string,
  type_mesure_id: string
}

export const messageAlertService = {
  ...createBaseService<MessageAlert>(
  pool,
  "message_alert",
  ["id"]
 
)}