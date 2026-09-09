import type { Request, Response } from "express";
import { bookingService } from "./booking.service.js";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);
    if (result.status !== 201) {
      res.status(result.status).json({ message: result.message });
      return;
    }
    res.status(201).json({ message: "Booking confirmed successfully", booking: result.data });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to create booking", error });
  }
};

export const getPartnerBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getPartnerHotelBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

export const getPartnerVehicleBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getPartnerVehicleBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const result = await bookingService.updateBookingStatus(
      req.params.id as string,
      status,
      { id: req.user.id, role: req.user.role }
    );
    if (result.status !== 200) {
      res.status(result.status).json({ message: result.message });
      return;
    }
    res.json({ message: "Booking status updated successfully", booking: result.data });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
