import express from "express";
import { getAllHotels, getAllVehicles } from "../controllers/serviceController.js";

const router = express.Router();

router.get("/hotels", getAllHotels);
router.get("/vehicles", getAllVehicles);

export default router;
