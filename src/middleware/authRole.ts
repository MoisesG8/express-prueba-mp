import { Request, Response, NextFunction } from "express";

export function requireRoles(...rolesPermitidos: number[]) {
    return (req: Request & { user?: any }, res: Response, next: NextFunction) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "No autenticado"
            });
        }

        const rolUsuario = req.user.rol_id;

        if (!rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({
                success: false,
                message: "No tiene permisos para realizar esta acción"
            });
        }

        next();
    };
}

