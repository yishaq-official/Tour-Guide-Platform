import type { Request, Response } from "express";
import { Heritage } from "../models/Heritage.js";

export const getAllHeritages = async (req: Request, res: Response) => {
  try {
    const heritages = await Heritage.find();
    res.json(heritages);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getHeritageById = async (req: Request, res: Response) => {
  try {
    const heritage = await Heritage.findById(req.params.id);
    if (!heritage) {
      res.status(404).json({ message: "Heritage not found" });
      return;
    }
    res.json(heritage);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createHeritage = async (req: Request, res: Response) => {
  try {
    const heritage = new Heritage(req.body);
    await heritage.save();
    res.status(201).json(heritage);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateHeritage = async (req: Request, res: Response) => {
  try {
    const heritage = await Heritage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!heritage) {
      res.status(404).json({ message: "Heritage not found" });
      return;
    }
    res.json(heritage);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const deleteHeritage = async (req: Request, res: Response) => {
  try {
    const heritage = await Heritage.findByIdAndDelete(req.params.id);
    if (!heritage) {
      res.status(404).json({ message: "Heritage not found" });
      return;
    }
    res.json({ message: "Heritage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
