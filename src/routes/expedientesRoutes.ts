import { Router } from "express";
import expedientesController from "../controllers/expedientesController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRoles } from "../middleware/authRole";


const router = Router();

router.post("/crearExpediente", expedientesController.crearExpediente);
router.get("/listarExpedientes", expedientesController.listar);

router.put(
    "/:id/estado",
    authMiddleware,
    requireRoles(1, 2), // ADMIN o COORDINADOR
    expedientesController.cambiarEstado
);

router.get(
    "/reporte/pdf",
    expedientesController.generarReportePDF
);

export default router;
