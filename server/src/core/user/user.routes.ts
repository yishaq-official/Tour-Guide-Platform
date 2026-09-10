import express from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { validateRequest } from "../../common/middleware/validateRequest.js";
import {
  toggleFavoriteSchema,
  addToItinerarySchema,
  syncItinerarySchema,
} from "./user.validation.js";
import {
  getFavorites,
  toggleFavorite,
  getItinerary,
  addToItinerary,
  removeFromItinerary,
  syncItinerary,
  getUserBookings,
  cancelBooking,
} from "./user.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/favorites", getFavorites);
router.post("/favorites", validateRequest(toggleFavoriteSchema), toggleFavorite);

router.get("/itinerary", getItinerary);
router.post("/itinerary", validateRequest(addToItinerarySchema), addToItinerary);
router.put("/itinerary/sync", validateRequest(syncItinerarySchema), syncItinerary);
router.delete("/itinerary/:id", removeFromItinerary);

router.get("/bookings", getUserBookings);
router.put("/bookings/:id/cancel", cancelBooking);

export default router;
