import express from "express";
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getPartnerHotels,
  createPartnerHotel,
  updatePartnerHotel,
  deletePartnerHotel,
} from "./hotel.controller.js";
import { requireAuth, requireAdmin, requireHotel } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/hotels", getAllHotels);
router.get("/hotels/:id", getHotelById);

// Admin-only catalog routes
router.post("/hotels", requireAuth, requireAdmin, createHotel);
router.put("/hotels/:id", requireAuth, requireAdmin, updateHotel);
router.delete("/hotels/:id", requireAuth, requireAdmin, deleteHotel);

// Partner-scoped routes
router.get("/partner/hotels", requireAuth, requireHotel, getPartnerHotels);
router.post("/partner/hotels", requireAuth, requireHotel, createPartnerHotel);
router.put("/partner/hotels/:id", requireAuth, requireHotel, updatePartnerHotel);
router.delete("/partner/hotels/:id", requireAuth, requireHotel, deletePartnerHotel);

export default router;
