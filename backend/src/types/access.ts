
import type { UserPayload } from "../middleware/authMiddleware";

export type Role = "admin" | "veterinaire" ;

export type CrudAction =
  | "create"
  | "read"
  | "update"
  | "delete";

export type CrudPermissions = Partial<
  Record<Role, CrudAction[]>
>;

export type AccessConfig = {
  field?: string;
  joins?: string[];

};

export type QueryContext = {
  user: UserPayload;
  userId: number;
  enableAccess?: boolean;
};
