import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface UserPayload {
  sub: number
  email: string;
  role: number;
}

export interface AuthRequest extends Request {
  user?: UserPayload
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: "Token manquant" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Token invalide" })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

   if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("sub" in decoded) ||
      !("email" in decoded)
    ) {
      return res.status(401).json({
        message: "Token invalide"
      });
    }

    req.user = {
      sub: Number(decoded.sub),
      email: String(decoded.email),
      role: Number(decoded)
    };

    next()
  } catch (error) {
    return res.status(401).json({ message: "Non autorisé" })
  }

}