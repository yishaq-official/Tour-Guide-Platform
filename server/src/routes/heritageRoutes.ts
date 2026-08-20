import express from "express";
import { getAllHeritages, getHeritageById, createHeritage, updateHeritage, deleteHeritage } from "../controllers/heritageController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllHeritages);
router.get("/:id", getHeritageById);

router.post("/", requireAuth, requireAdmin, createHeritage);
router.put("/:id", requireAuth, requireAdmin, updateHeritage);
router.delete("/:id", requireAuth, requireAdmin, deleteHeritage);

export default router;
