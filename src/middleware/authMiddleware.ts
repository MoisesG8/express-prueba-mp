import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request & { user?: any }, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "No autenticado"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;  // <<---- ESTE PASO ES CRÍTICO
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado"
        });
    }
}