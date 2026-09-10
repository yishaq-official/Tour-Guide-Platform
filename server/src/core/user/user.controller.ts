import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service.js";

export const getFavorites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const favorites = await userService.getFavorites(req.user.id);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { itemId, itemModel } = req.body;
    const favorites = await userService.toggleFavorite(req.user.id, itemId, itemModel);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

export const getItinerary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itinerary = await userService.getItinerary(req.user.id);
    res.json(itinerary);
  } catch (error) {
    next(error);
  }
};

export const addToItinerary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itinerary = await userService.addToItinerary(req.user.id, req.body);
    res.json(itinerary);
  } catch (error) {
    next(error);
  }
};

export const removeFromItinerary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itinerary = await userService.removeFromItinerary(req.user.id, req.params.id as string);
    res.json(itinerary);
  } catch (error) {
    next(error);
  }
};

export const syncItinerary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itinerary = await userService.syncItinerary(req.user.id, req.body.itinerary);
    res.json(itinerary);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookings = await userService.getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await userService.cancelBooking(req.user.id, req.params.id as string);
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    next(error);
  }
};
