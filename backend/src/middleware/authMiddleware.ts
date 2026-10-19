
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {pool} from "../config/db";

export interface UserPayload {
  sub: number;
  email: string;
  role: string;
  niveau_id: number | null;
  actif: boolean;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token manquant ou invalide",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        message: "Token manquant",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET non configuré");

      return res.status(500).json({
        message: "Erreur de configuration du serveur",
      });
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.sub !== "string" &&
        typeof decoded.sub !== "number"
    ) {
      return res.status(401).json({
        message: "Token invalide",
      });
    }

    const userId = Number(decoded.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: "Identifiant invalide",
      });
    }

    // Charger les droits actuels depuis PostgreSQL.
    const result = await pool.query(
      `SELECT id, email, role, niveau_id, actif
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Utilisateur introuvable",
      });
    }

    const user = result.rows[0];

    if (user.actif !== true) {
      return res.status(403).json({
        message: "Compte désactivé",
      });
    }

    req.user = {
      sub: Number(user.id),
      email: String(user.email),
      role: String(user.role),
      niveau_id:
        user.niveau_id == null
          ? null
          : Number(user.niveau_id),
      actif: user.actif,
    };

    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({
        message: "Token invalide ou expiré",
      });
    }

    console.error("Erreur authMiddleware:", error);

    return res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};
