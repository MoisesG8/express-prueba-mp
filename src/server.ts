import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/index";
import "./config/db";
import authRoutes from "./routes/authRoutes";
import expedientesRoutes from "./routes/expedientesRoutes";
import indiciosRoutes from "./routes/indiciosRoutes";
import usuariosRoutes from "./routes/usuariosRoutes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api", router);
app.use("/expedientes", expedientesRoutes);
app.use("/indicios", indiciosRoutes);
app.use("/usuarios", usuariosRoutes);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor MP iniciado en puerto ${PORT}`);
});
