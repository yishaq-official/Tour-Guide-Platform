import { servicesRepository, ServicesRepository } from "./services.repository.js";

export class VehicleService {
  constructor(private repo: ServicesRepository = servicesRepository) {}

  async getAllVehicles() {
    return await this.repo.getAllVehicles();
  }

  async getVehicleById(id: string) {
    return await this.repo.getVehicleById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createVehicle(data: any) {
    return await this.repo.createVehicle(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateVehicle(id: string, data: any) {
    return await this.repo.updateVehicle(id, data);
  }

  async deleteVehicle(id: string) {
    return await this.repo.deleteVehicle(id);
  }

  async getPartnerVehicles(ownerId: string) {
    return await this.repo.getVehiclesByOwner(ownerId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createPartnerVehicle(data: any, ownerId: string) {
    return await this.repo.createVehicle({
      ...data,
      ownerId,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updatePartnerVehicle(id: string, data: any, ownerId: string, isAdmin: boolean) {
    const vehicle = await this.repo.getVehicleById(id);
    if (!vehicle) {
      return { status: 404, message: "Vehicle not found" };
    }
    if (vehicle.ownerId !== ownerId && !isAdmin) {
      return { status: 403, message: "Forbidden: Not the owner of this vehicle" };
    }
    const updated = await this.repo.updateVehicle(id, data);
    return { status: 200, data: updated };
  }

  async deletePartnerVehicle(id: string, ownerId: string, isAdmin: boolean) {
    const vehicle = await this.repo.getVehicleById(id);
    if (!vehicle) {
      return { status: 404, message: "Vehicle not found" };
    }
    if (vehicle.ownerId !== ownerId && !isAdmin) {
      return { status: 403, message: "Forbidden: Not the owner of this vehicle" };
    }
    await this.repo.deleteVehicle(id);
    return { status: 200, message: "Vehicle deleted successfully" };
  }
}

export const vehicleService = new VehicleService();
