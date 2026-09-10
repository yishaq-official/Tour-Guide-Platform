import express from "express";
import {
  createBooking,
  getPartnerBookings,
  getPartnerVehicleBookings,
  updateBookingStatus,
} from "./booking.controller.js";
import { requireAuth, requireHotel, requirePartner } from "../../middleware/authMiddleware.js";
import { validateRequest } from "../../common/middleware/validateRequest.js";
import { createBookingSchema, updateBookingStatusSchema } from "./booking.validation.js";

const router = express.Router();

// Public booking creation
router.post("/book", validateRequest(createBookingSchema), createBooking);

// Hotel Partner-scoped bookings
router.get("/partner/bookings", requireAuth, requireHotel, getPartnerBookings);

// Vehicle Partner-scoped bookings
router.get("/partner/vehicle-bookings", requireAuth, requirePartner, getPartnerVehicleBookings);

// Booking status update (Hotel & Vehicle partners)
router.put(
  "/partner/bookings/:id/status",
  requireAuth,
  requirePartner,
  validateRequest(updateBookingStatusSchema),
  updateBookingStatus
);

export default router;

