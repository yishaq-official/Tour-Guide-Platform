import express from "express";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import type { Request, Response } from "express";
import { env } from "./config/env.config.js";
import { errorHandler } from "./common/middleware/errorHandler.js";
import heritageRoutes from "./routes/heritageRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import cultureRoutes from "./routes/cultureRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";

const app = express();

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api/heritages", heritageRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/cultures", cultureRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rag", ragRoutes);

app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello World");
});

// Centralized error handler
app.use(errorHandler);

export default app;