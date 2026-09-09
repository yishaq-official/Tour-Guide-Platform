import type { Request, Response } from "express";
import { hotelService } from "./hotel.service.js";

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await hotelService.getAllHotels();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id as string);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await hotelService.createHotel(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await hotelService.updateHotel(req.params.id as string, req.body);
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
    const hotel = await hotelService.deleteHotel(req.params.id as string);
    if (!hotel) {
      res.status(404).json({ message: "Hotel not found" });
      return;
    }
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getPartnerHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await hotelService.getPartnerHotels(req.user.id);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hotels", error });
  }
};

export const createPartnerHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await hotelService.createPartnerHotel(req.body, req.user.id);
    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updatePartnerHotel = async (req: Request, res: Response) => {
  try {
    const result = await hotelService.updatePartnerHotel(
      req.params.id as string,
      req.body,
      req.user.id,
      req.user.role === "admin"
    );
    if (result.status !== 200) {
      res.status(result.status).json({ message: result.message });
      return;
    }
    res.json(result.data);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const deletePartnerHotel = async (req: Request, res: Response) => {
  try {
    const result = await hotelService.deletePartnerHotel(
      req.params.id as string,
      req.user.id,
      req.user.role === "admin"
    );
    if (result.status !== 200) {
      res.status(result.status).json({ message: result.message });
      return;
    }
    res.json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
