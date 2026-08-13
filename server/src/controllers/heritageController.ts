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
