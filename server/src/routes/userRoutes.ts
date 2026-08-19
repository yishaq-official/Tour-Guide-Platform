import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { 
    getFavorites, 
    toggleFavorite, 
    getItinerary, 
    addToItinerary, 
    removeFromItinerary,
    syncItinerary,
    getUserBookings,
    cancelBooking
} from "../controllers/userController.js";

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

router.get("/favorites", getFavorites);
router.post("/favorites", toggleFavorite);

router.get("/itinerary", getItinerary);
router.post("/itinerary", addToItinerary);
router.put("/itinerary/sync", syncItinerary);
router.delete("/itinerary/:id", removeFromItinerary);

router.get("/bookings", getUserBookings);
router.put("/bookings/:id/cancel", cancelBooking);

export default router;
