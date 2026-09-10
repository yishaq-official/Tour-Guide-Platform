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
import { validateRequest } from "../../common/middleware/validateRequest.js";
import { hotelSchema } from "./services.validation.js";

const router = express.Router();

// Public
router.get("/hotels", getAllHotels);
router.get("/hotels/:id", getHotelById);

// Admin-only catalog routes
router.post("/hotels", requireAuth, requireAdmin, validateRequest(hotelSchema), createHotel);
router.put("/hotels/:id", requireAuth, requireAdmin, validateRequest(hotelSchema.partial()), updateHotel);
router.delete("/hotels/:id", requireAuth, requireAdmin, deleteHotel);

// Partner-scoped routes
router.get("/partner/hotels", requireAuth, requireHotel, getPartnerHotels);
router.post("/partner/hotels", requireAuth, requireHotel, validateRequest(hotelSchema), createPartnerHotel);
router.put("/partner/hotels/:id", requireAuth, requireHotel, validateRequest(hotelSchema.partial()), updatePartnerHotel);
router.delete("/partner/hotels/:id", requireAuth, requireHotel, deletePartnerHotel);

export default router;

