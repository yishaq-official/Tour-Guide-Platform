import type { Request, Response } from "express";
import { UserTripData } from "../models/UserTripData.js";
import { Booking } from "../models/Booking.js";

const getOrCreateTripData = async (userId: string) => {
  let data = await UserTripData.findOne({ userId }).populate('favorites.itemId').populate('itinerary.itemId');
  if (!data) {
    data = await UserTripData.create({ userId, favorites: [], itinerary: [] });
  }
  return data;
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const data = await getOrCreateTripData(req.user.id);
    res.json(data.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const { itemId, itemModel } = req.body;
    const data = await getOrCreateTripData(req.user.id);
    
    const existingIndex = data.favorites.findIndex(f => f.itemId && f.itemId.toString() === itemId);
    
    if (existingIndex > -1) {
      data.favorites.splice(existingIndex, 1);
    } else {
      data.favorites.push({ itemId, itemModel });
    }
    
    await data.save();
    // Repopulate for response
    await data.populate('favorites.itemId');
    res.json(data.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getItinerary = async (req: Request, res: Response) => {
  try {
    const data = await getOrCreateTripData(req.user.id);
    res.json(data.itinerary);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const addToItinerary = async (req: Request, res: Response) => {
  try {
    const { day, itemId, itemModel, notes } = req.body;
    const data = await getOrCreateTripData(req.user.id);
    
    data.itinerary.push({ day, itemId, itemModel, notes });
    await data.save();
    await data.populate('itinerary.itemId');
    
    res.json(data.itinerary);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const removeFromItinerary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // _id of the itinerary item itself
    const data = await getOrCreateTripData(req.user.id);
    
    data.itinerary = data.itinerary.filter(item => item._id?.toString() !== id) as any;
    await data.save();
    
    res.json(data.itinerary);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('itemId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }
    booking.status = 'Cancelled';
    await booking.save();
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
