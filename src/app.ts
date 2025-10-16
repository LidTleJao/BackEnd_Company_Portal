import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bannersRoutes from "./routes/bannersRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/v1", authRoutes);
app.use("/v1/banners", bannersRoutes);
app.use("/v1/admin", adminRoutes);
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;