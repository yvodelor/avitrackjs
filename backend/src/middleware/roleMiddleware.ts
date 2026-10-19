import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (minLevel?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Non authentifié",
      });
    }

    // Vérifier que le compte est actif.
    if (user.actif !== true) {
      return res.status(403).json({
        message: "Compte désactivé",
      });
    }

    // Seuls les administrateurs accèdent aux routes Admin.
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Accès réservé aux administrateurs",
      });
    }

    // Vérification du niveau administratif si nécessaire.
    if (minLevel !== undefined) {
      const niveau = user.niveau_id;

      if (
        niveau == null ||
        !Number.isInteger(Number(niveau)) ||
        Number(niveau) < minLevel
      ) {
        return res.status(403).json({
          message: "Niveau administratif insuffisant",
        });
      }
    }

    return next();
  };
};