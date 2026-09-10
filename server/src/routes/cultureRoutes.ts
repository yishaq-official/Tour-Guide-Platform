import express from "express";
import { getCultures, getCultureById, createCulture, updateCulture, deleteCulture } from "../controllers/cultureController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../common/middleware/validateRequest.js";
import { cultureSchema } from "../core/catalog/catalog.validation.js";

const router = express.Router();

router.get("/", getCultures);
router.get("/:id", getCultureById);

router.post("/", requireAuth, requireAdmin, validateRequest(cultureSchema), createCulture);
router.put("/:id", requireAuth, requireAdmin, validateRequest(cultureSchema.partial()), updateCulture);
router.delete("/:id", requireAuth, requireAdmin, deleteCulture);

export default router;

