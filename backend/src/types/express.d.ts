import { UserPayload } from "../middleware/auth.middleware";
import { QueryContext } from "./access";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      queryContext?: QueryContext;
    }
  }
}

export {};