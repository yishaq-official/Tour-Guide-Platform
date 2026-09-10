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
import { validateRequest } from "../../common/middleware/validateRequest.js";
import { vehicleSchema } from "./services.validation.js";

const router = express.Router();

// Public
router.get("/vehicles", getAllVehicles);
router.get("/vehicles/:id", getVehicleById);

// Admin-only catalog routes
router.post("/vehicles", requireAuth, requireAdmin, validateRequest(vehicleSchema), createVehicle);
router.put("/vehicles/:id", requireAuth, requireAdmin, validateRequest(vehicleSchema.partial()), updateVehicle);
router.delete("/vehicles/:id", requireAuth, requireAdmin, deleteVehicle);

// Partner-scoped routes (accessible by 'car' partner role or 'admin')
router.get("/partner/vehicles", requireAuth, requirePartner, getPartnerVehicles);
router.post("/partner/vehicles", requireAuth, requirePartner, validateRequest(vehicleSchema), createPartnerVehicle);
router.put("/partner/vehicles/:id", requireAuth, requirePartner, validateRequest(vehicleSchema.partial()), updatePartnerVehicle);
router.delete("/partner/vehicles/:id", requireAuth, requirePartner, deletePartnerVehicle);

export default router;

