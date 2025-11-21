import { Request, Response } from "express";
import indiciosService from "../services/indiciosService";

class IndiciosController {

    async crear(req: Request, res: Response) {
        try {
            const data = req.body;

            const resultado = await indiciosService.crearIndicio(data);

            return res.json(resultado);

        } catch (error: any) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const result = await indiciosService.listarIndicios(req.query);
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

export default new IndiciosController();
