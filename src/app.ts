import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/v1", authRoutes);
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;