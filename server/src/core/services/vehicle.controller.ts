import type { Request, Response } from "express";
import { vehicleService } from "./vehicle.service.js";

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id as string);
    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id as string, req.body);
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
    const vehicle = await vehicleService.deleteVehicle(req.params.id as string);
    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getPartnerVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getPartnerVehicles(req.user.id);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles", error });
  }
};

export const createPartnerVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.createPartnerVehicle(req.body, req.user.id);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updatePartnerVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.updatePartnerVehicle(
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

export const deletePartnerVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.deletePartnerVehicle(
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
