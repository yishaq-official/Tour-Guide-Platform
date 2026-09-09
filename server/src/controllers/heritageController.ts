import type { Request, Response } from "express";
import { heritageService } from "../core/catalog/heritage.service.js";

export const getAllHeritages = async (req: Request, res: Response) => {
  try {
    const heritages = await heritageService.getAllHeritages();
    res.json(heritages);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getHeritageById = async (req: Request, res: Response) => {
  try {
    const heritage = await heritageService.getHeritageById(req.params.id as string);
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
    const heritage = await heritageService.createHeritage(req.body);
    res.status(201).json(heritage);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateHeritage = async (req: Request, res: Response) => {
  try {
    const heritage = await heritageService.updateHeritage(req.params.id as string, req.body);
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
    const heritage = await heritageService.deleteHeritage(req.params.id as string);
    if (!heritage) {
      res.status(404).json({ message: "Heritage not found" });
      return;
    }
    res.json({ message: "Heritage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
