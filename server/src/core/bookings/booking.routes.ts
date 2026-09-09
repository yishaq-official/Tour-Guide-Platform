import express from "express";
import {
  createBooking,
  getPartnerBookings,
  getPartnerVehicleBookings,
  updateBookingStatus,
} from "./booking.controller.js";
import { requireAuth, requireHotel, requirePartner } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public booking creation
router.post("/book", createBooking);

// Hotel Partner-scoped bookings
router.get("/partner/bookings", requireAuth, requireHotel, getPartnerBookings);

// Vehicle Partner-scoped bookings
router.get("/partner/vehicle-bookings", requireAuth, requirePartner, getPartnerVehicleBookings);

// Booking status update (Hotel & Vehicle partners)
router.put("/partner/bookings/:id/status", requireAuth, requirePartner, updateBookingStatus);

export default router;
