import { Router } from "express";
import authRoutes from "./authRoutes";
import expedientesRoutes from "./expedientesRoutes";
import indiciosRoutes from "./indiciosRoutes";
import usuariosRoutes from "./usuariosRoutes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/expedientes", expedientesRoutes);
router.use("/indicios", indiciosRoutes);
router.use("/usuarios", usuariosRoutes);

router.get("/", (req, res) => {
    res.send("API Expedientes funcionando.");
});

export { router };
