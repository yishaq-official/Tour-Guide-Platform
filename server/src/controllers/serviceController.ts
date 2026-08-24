import type { Request, Response } from "express";
import { Hotel } from "../models/Hotel.js";
import { Vehicle } from "../models/Vehicle.js";
import { Booking } from "../models/Booking.js";

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { 
      itemId, 
      itemModel, 
      customerName, 
      customerEmail, 
      phone,
      guests,
      roomType,
      specialRequests,
      pickupLocation,
      dropoffLocation,
      startDate,
      endDate,
      totalPrice, 
      userId 
    } = req.body;
    
    // Basic validation
    if (!itemId || !itemModel || !customerName || !customerEmail || !phone || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: "All fields are required (itemId, itemModel, customerName, customerEmail, phone, startDate, endDate, totalPrice)" });
    }

    const newBooking = new Booking({
      itemId,
      itemModel,
      customerName,
      customerEmail,
      phone,
      guests: guests || 1,
      roomType,
      specialRequests,
      pickupLocation,
      dropoffLocation,
      startDate,
      endDate,
      totalPrice,
      userId
    });

    await newBooking.save();
    
    res.status(201).json({ message: "Booking confirmed successfully", booking: newBooking });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to create booking", error });
  }
};

export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }
    res.json(hotel);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getPartnerHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ ownerId: req.user.id });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hotels", error });
  }
};

export const createPartnerHotel = async (req: Request, res: Response) => {
  try {
    const hotel = new Hotel({
      ...req.body,
      ownerId: req.user.id
    });
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updatePartnerHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }
    if (hotel.ownerId !== req.user.id && req.user.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Not the owner of this hotel" });
      return;
    }
    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updatedHotel);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const deletePartnerHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }
    if (hotel.ownerId !== req.user.id && req.user.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Not the owner of this hotel" });
      return;
    }
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getPartnerBookings = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ ownerId: req.user.id });
    const hotelIds = hotels.map(h => h._id);
    const bookings = await Booking.find({ itemId: { $in: hotelIds }, itemModel: "Hotel" });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }
    
    // Authorization check
    if (req.user.role !== "admin") {
      if (booking.itemModel !== "Hotel") {
        res.status(403).json({ message: "Forbidden: Not authorized to manage this booking" });
        return;
      }
      const hotel = await Hotel.findById(booking.itemId);
      if (!hotel || hotel.ownerId !== req.user.id) {
        res.status(403).json({ message: "Forbidden: Not authorized to manage bookings for this hotel" });
        return;
      }
    }
    
    booking.status = status;
    await booking.save();
    res.json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
