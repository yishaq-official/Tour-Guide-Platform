import express from "express";
import { getAllHeritages, getHeritageById, createHeritage, updateHeritage, deleteHeritage } from "../controllers/heritageController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../common/middleware/validateRequest.js";
import { heritageSchema } from "../core/catalog/catalog.validation.js";

const router = express.Router();

router.get("/", getAllHeritages);
router.get("/:id", getHeritageById);

router.post("/", requireAuth, requireAdmin, validateRequest(heritageSchema), createHeritage);
router.put("/:id", requireAuth, requireAdmin, validateRequest(heritageSchema.partial()), updateHeritage);
router.delete("/:id", requireAuth, requireAdmin, deleteHeritage);

export default router;

