import type { Request, Response } from "express";
import { aiService } from "./ai.service.js";

export const queryRAGSystem = async (req: Request, res: Response) => {
  try {
    const { query, contextSiteId, contextType } = req.body;

    if (!query || typeof query !== "string") {
      res.status(400).json({ message: "Query string is required" });
      return;
    }

    const response = await aiService.processQuery({
      query,
      contextSiteId,
      contextType,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("RAG Query Error:", error);
    res.status(500).json({
      message: "An error occurred while processing the RAG AI query",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
