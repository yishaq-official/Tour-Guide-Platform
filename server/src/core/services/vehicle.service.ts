import { Vehicle } from "../../models/Vehicle.js";

export class VehicleService {
  async getAllVehicles() {
    return await Vehicle.find();
  }

  async getVehicleById(id: string) {
    return await Vehicle.findById(id);
  }

  async createVehicle(data: any) {
    const vehicle = new Vehicle(data);
    return await vehicle.save();
  }

  async updateVehicle(id: string, data: any) {
    return await Vehicle.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteVehicle(id: string) {
    return await Vehicle.findByIdAndDelete(id);
  }

  async getPartnerVehicles(ownerId: string) {
    return await Vehicle.find({ ownerId });
  }

  async createPartnerVehicle(data: any, ownerId: string) {
    const vehicle = new Vehicle({
      ...data,
      ownerId,
    });
    return await vehicle.save();
  }

  async updatePartnerVehicle(id: string, data: any, ownerId: string, isAdmin: boolean) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return { status: 404, message: "Vehicle not found" };
    }
    if (vehicle.ownerId !== ownerId && !isAdmin) {
      return { status: 403, message: "Forbidden: Not the owner of this vehicle" };
    }
    const updated = await Vehicle.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return { status: 200, data: updated };
  }

  async deletePartnerVehicle(id: string, ownerId: string, isAdmin: boolean) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return { status: 404, message: "Vehicle not found" };
    }
    if (vehicle.ownerId !== ownerId && !isAdmin) {
      return { status: 403, message: "Forbidden: Not the owner of this vehicle" };
    }
    await Vehicle.findByIdAndDelete(id);
    return { status: 200, message: "Vehicle deleted successfully" };
  }
}

export const vehicleService = new VehicleService();
