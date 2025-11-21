import { Request, Response } from "express";
import usuariosService from "../services/usuariosService";

class UsuariosController {

    async listar(req: Request, res: Response) {
        try {
            const result = await usuariosService.listarUsuarios(req.query);
            return res.json(result);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

}

export default new UsuariosController();
