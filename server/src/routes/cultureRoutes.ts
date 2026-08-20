import express from "express";
import { getCultures, getCultureById, createCulture, updateCulture, deleteCulture } from "../controllers/cultureController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCultures);
router.get("/:id", getCultureById);

router.post("/", requireAuth, requireAdmin, createCulture);
router.put("/:id", requireAuth, requireAdmin, updateCulture);
router.delete("/:id", requireAuth, requireAdmin, deleteCulture);

export default router;
