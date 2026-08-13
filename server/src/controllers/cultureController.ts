import type { Request, Response } from "express";
import { Culture } from "../models/Culture.js";

export const getCultures = async (req: Request, res: Response) => {
  try {
    const cultures = await Culture.find({});
    res.json(cultures);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCultureById = async (req: Request, res: Response) => {
  try {
    const culture = await Culture.findById(req.params.id);
    if (!culture) {
      res.status(404).json({ message: "Culture not found" });
      return;
    }
    res.json(culture);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
