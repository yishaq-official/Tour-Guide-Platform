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

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
