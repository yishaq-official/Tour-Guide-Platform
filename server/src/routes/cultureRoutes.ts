import express from "express";
import { getCultures, getCultureById } from "../controllers/cultureController.js";

const router = express.Router();

router.get("/", getCultures);
router.get("/:id", getCultureById);

export default router;
