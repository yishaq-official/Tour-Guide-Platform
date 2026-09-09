import type { Request, Response } from "express";
import { cultureService } from "../core/catalog/culture.service.js";

export const getCultures = async (req: Request, res: Response) => {
  try {
    const cultures = await cultureService.getAllCultures();
    res.json(cultures);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCultureById = async (req: Request, res: Response) => {
  try {
    const culture = await cultureService.getCultureById(req.params.id as string);
    if (!culture) {
      res.status(404).json({ message: "Culture not found" });
      return;
    }
    res.json(culture);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createCulture = async (req: Request, res: Response) => {
  try {
    const culture = await cultureService.createCulture(req.body);
    res.status(201).json(culture);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateCulture = async (req: Request, res: Response) => {
  try {
    const culture = await cultureService.updateCulture(req.params.id as string, req.body);
    if (!culture) {
      res.status(404).json({ message: "Culture not found" });
      return;
    }
    res.json(culture);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const deleteCulture = async (req: Request, res: Response) => {
  try {
    const culture = await cultureService.deleteCulture(req.params.id as string);
    if (!culture) {
      res.status(404).json({ message: "Culture not found" });
      return;
    }
    res.json({ message: "Culture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
