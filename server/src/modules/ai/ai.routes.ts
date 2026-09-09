import { Router } from "express";
import { queryRAGSystem } from "./ai.controller.js";

const router = Router();

// POST /api/rag/query (or /api/v1/ai/query)
router.post("/query", queryRAGSystem);

export default router;
