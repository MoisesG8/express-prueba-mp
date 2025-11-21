import { Router } from "express";
import usuariosController from "../controllers/usuariosController";

const router = Router();

router.get("/listarUsuarios", usuariosController.listar);

export default router;
