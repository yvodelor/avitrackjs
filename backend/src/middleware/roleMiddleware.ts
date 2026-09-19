import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (minLevel: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const userLevel = user.role; // ton champ int

    if (userLevel < minLevel) {
      return res.status(403).json({
        message: "Accès refusé : niveau insuffisant",
      });
    }

    next();
  };
};