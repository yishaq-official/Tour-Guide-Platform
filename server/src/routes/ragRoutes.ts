import { Router } from "express";
import { queryRAGSystem } from "../controllers/ragController.js";

const router = Router();

// POST /api/rag/query
router.post("/query", queryRAGSystem);

export default router;
