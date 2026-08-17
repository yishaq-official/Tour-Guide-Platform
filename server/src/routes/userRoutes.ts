import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { 
    getFavorites, 
    toggleFavorite, 
    getItinerary, 
    addToItinerary, 
    removeFromItinerary,
    getUserBookings
} from "../controllers/userController.js";

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

router.get("/favorites", getFavorites);
router.post("/favorites", toggleFavorite);

router.get("/itinerary", getItinerary);
router.post("/itinerary", addToItinerary);
router.delete("/itinerary/:id", removeFromItinerary);

router.get("/bookings", getUserBookings);

export default router;
