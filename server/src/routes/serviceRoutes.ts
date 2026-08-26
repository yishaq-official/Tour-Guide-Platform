import express from "express";
import { 
  getAllHotels, 
  getHotelById, 
  getAllVehicles, 
  getVehicleById, 
  createBooking, 
  createHotel, 
  updateHotel, 
  deleteHotel, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle,
  getPartnerHotels,
  createPartnerHotel,
  updatePartnerHotel,
  deletePartnerHotel,
  getPartnerBookings,
  updateBookingStatus,
  getPartnerVehicles,
  createPartnerVehicle,
  updatePartnerVehicle,
  deletePartnerVehicle,
  getPartnerVehicleBookings
} from "../controllers/serviceController.js";
import { requireAuth, requireAdmin, requireHotel, requirePartner } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public and General Routes
router.get("/hotels", getAllHotels);
router.get("/hotels/:id", getHotelById);
router.get("/vehicles", getAllVehicles);
router.get("/vehicles/:id", getVehicleById);
router.post("/book", createBooking);

// Admin-only catalog routes
router.post("/hotels", requireAuth, requireAdmin, createHotel);
router.put("/hotels/:id", requireAuth, requireAdmin, updateHotel);
router.delete("/hotels/:id", requireAuth, requireAdmin, deleteHotel);
router.post("/vehicles", requireAuth, requireAdmin, createVehicle);
router.put("/vehicles/:id", requireAuth, requireAdmin, updateVehicle);
router.delete("/vehicles/:id", requireAuth, requireAdmin, deleteVehicle);

// Hotel Partner-scoped routes (accessible by 'hotel' partner role or 'admin')
router.get("/partner/hotels", requireAuth, requireHotel, getPartnerHotels);
router.post("/partner/hotels", requireAuth, requireHotel, createPartnerHotel);
router.put("/partner/hotels/:id", requireAuth, requireHotel, updatePartnerHotel);
router.delete("/partner/hotels/:id", requireAuth, requireHotel, deletePartnerHotel);
router.get("/partner/bookings", requireAuth, requireHotel, getPartnerBookings);

// Car Rental Partner-scoped routes (accessible by 'car' partner role or 'admin')
router.get("/partner/vehicles", requireAuth, requirePartner, getPartnerVehicles);
router.post("/partner/vehicles", requireAuth, requirePartner, createPartnerVehicle);
router.put("/partner/vehicles/:id", requireAuth, requirePartner, updatePartnerVehicle);
router.delete("/partner/vehicles/:id", requireAuth, requirePartner, deletePartnerVehicle);
router.get("/partner/vehicle-bookings", requireAuth, requirePartner, getPartnerVehicleBookings);

// Booking status updates (shared by all partners, role authorization checked dynamically inside handler)
router.put("/partner/bookings/:id/status", requireAuth, requirePartner, updateBookingStatus);

export default router;
