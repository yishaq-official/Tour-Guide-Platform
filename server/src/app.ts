import express from "express";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import type {Request, Response} from "express";
import dotenv from "dotenv";
import heritageRoutes from "./routes/heritageRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api/heritages", heritageRoutes);
app.use("/api/services", serviceRoutes);

app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello World");
});

export default app;