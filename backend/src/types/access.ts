import { UserPayload } from "../middleware/authMiddleware";

export type AccessConfig = {
    field?: string;      // ex: user_id, bot.user_id
    joins?: string[];
};


export type QueryContext = {
    user?: UserPayload;  // utilisateur complet
    userId?: number;     // raccourci pour les requêtes SQL
    enableAccess?: boolean;
};