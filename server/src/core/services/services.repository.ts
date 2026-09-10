import { Hotel } from "../../models/Hotel.js";
import { Vehicle } from "../../models/Vehicle.js";

export class ServicesRepository {
  // Hotel Data Access
  async getAllHotels() {
    return await Hotel.find();
  }

  async getHotelById(id: string) {
    return await Hotel.findById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createHotel(data: any) {
    const hotel = new Hotel(data);
    return await hotel.save();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateHotel(id: string, data: any) {
    return await Hotel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteHotel(id: string) {
    return await Hotel.findByIdAndDelete(id);
  }

  async getHotelsByOwner(ownerId: string) {
    return await Hotel.find({ ownerId });
  }

  // Vehicle Data Access
  async getAllVehicles() {
    return await Vehicle.find();
  }

  async getVehicleById(id: string) {
    return await Vehicle.findById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createVehicle(data: any) {
    const vehicle = new Vehicle(data);
    return await vehicle.save();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateVehicle(id: string, data: any) {
    return await Vehicle.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteVehicle(id: string) {
    return await Vehicle.findByIdAndDelete(id);
  }

  async getVehiclesByOwner(ownerId: string) {
    return await Vehicle.find({ ownerId });
  }
}

export const servicesRepository = new ServicesRepository();
