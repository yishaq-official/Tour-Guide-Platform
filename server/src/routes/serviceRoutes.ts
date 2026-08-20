import express from "express";
import { getAllHotels, getHotelById, getAllVehicles, getVehicleById, createBooking, createHotel, updateHotel, deleteHotel, createVehicle, updateVehicle, deleteVehicle } from "../controllers/serviceController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/hotels", getAllHotels);
router.get("/hotels/:id", getHotelById);
router.post("/hotels", requireAuth, requireAdmin, createHotel);
router.put("/hotels/:id", requireAuth, requireAdmin, updateHotel);
router.delete("/hotels/:id", requireAuth, requireAdmin, deleteHotel);

router.get("/vehicles", getAllVehicles);
router.get("/vehicles/:id", getVehicleById);
router.post("/vehicles", requireAuth, requireAdmin, createVehicle);
router.put("/vehicles/:id", requireAuth, requireAdmin, updateVehicle);
router.delete("/vehicles/:id", requireAuth, requireAdmin, deleteVehicle);

router.post("/book", createBooking);

export default router;
