import express from "express";
import { getAllHotels, getHotelById, getAllVehicles, createBooking } from "../controllers/serviceController.js";

const router = express.Router();

router.get("/hotels", getAllHotels);
router.get("/hotels/:id", getHotelById);
router.get("/vehicles", getAllVehicles);
router.post("/book", createBooking);

export default router;
