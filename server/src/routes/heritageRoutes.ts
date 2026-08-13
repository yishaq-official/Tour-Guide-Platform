import express from "express";
import { getAllHeritages, getHeritageById } from "../controllers/heritageController.js";

const router = express.Router();

router.get("/", getAllHeritages);
router.get("/:id", getHeritageById);

export default router;
