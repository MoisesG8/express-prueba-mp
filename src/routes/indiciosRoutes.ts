import { Router } from "express";
import indiciosController from "../controllers/indiciosController";

const router = Router();

router.post("/crearIndicio", indiciosController.crear);
router.get("/listarIndicios", indiciosController.listar);

export default router;
