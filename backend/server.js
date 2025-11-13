// backend/server.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import nfeRoutes from "./routes/nfe.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", nfeRoutes);
app.use("/auth", authRoutes);

// Porta do servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
