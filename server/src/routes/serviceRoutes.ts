import express from "express";
import hotelRoutes from "../core/services/hotel.routes.js";
import vehicleRoutes from "../core/services/vehicle.routes.js";
import bookingRoutes from "../core/bookings/booking.routes.js";

const router = express.Router();

// Mount modular sub-routers
router.use(hotelRoutes);
router.use(vehicleRoutes);
router.use(bookingRoutes);

export default router;
