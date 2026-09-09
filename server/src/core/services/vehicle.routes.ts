import express from "express";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getPartnerVehicles,
  createPartnerVehicle,
  updatePartnerVehicle,
  deletePartnerVehicle,
} from "./vehicle.controller.js";
import { requireAuth, requireAdmin, requirePartner } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/vehicles", getAllVehicles);
router.get("/vehicles/:id", getVehicleById);

// Admin-only catalog routes
router.post("/vehicles", requireAuth, requireAdmin, createVehicle);
router.put("/vehicles/:id", requireAuth, requireAdmin, updateVehicle);
router.delete("/vehicles/:id", requireAuth, requireAdmin, deleteVehicle);

// Partner-scoped routes (accessible by 'car' partner role or 'admin')
router.get("/partner/vehicles", requireAuth, requirePartner, getPartnerVehicles);
router.post("/partner/vehicles", requireAuth, requirePartner, createPartnerVehicle);
router.put("/partner/vehicles/:id", requireAuth, requirePartner, updatePartnerVehicle);
router.delete("/partner/vehicles/:id", requireAuth, requirePartner, deletePartnerVehicle);

export default router;
