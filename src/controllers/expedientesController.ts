import { Request, Response } from "express";
import ExpedientesService from "../services/expedientesService";
import pdfService from "../services/pdfService";

class ExpedientesController {

    async crearExpediente(req: Request, res: Response) {
        try {
            const { descripcion } = req.body;
            const tecnico_id = req.body.tecnico_id || req.body.usuario_id;
            // req.usuario_id viene del middleware JWT (si usas uno)

            const resultado = await ExpedientesService.crearExpediente(descripcion, tecnico_id);

            res.json(resultado);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const filtros = req.query;

            const result = await ExpedientesService.listarExpedientes(filtros);

            res.json(result);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async cambiarEstado(req: Request & { user?: any }, res: Response) {
        try {
            const expediente_id = Number(req.params.id);
            const { nuevo_estado_id, comentario } = req.body;

            const usuario_id = req.user.usuario_id;

            const resultado = await ExpedientesService.cambiarEstado({
                expediente_id,
                nuevo_estado_id,
                usuario_id,
                comentario
            });

            res.json(resultado);

        } catch (error: any) {
            console.error(error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }


    async generarReportePDF(req: Request, res: Response): Promise<void> {
        try {
            const filtros = req.query;

            // Reutilizar el mismo servicio
            const result = await ExpedientesService.listarExpedientes(filtros);

            if (!result.success || !result.data || result.data.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No hay expedientes para generar el reporte'
                });
                return;
            }

            // Generar PDF con los datos obtenidos
            pdfService.generarReporteExpedientes(result.data, filtros, res);

        } catch (error: any) {
            console.error('Error al generar reporte PDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al generar el reporte'
            });
        }
    }

}

export default new ExpedientesController();
