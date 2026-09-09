import { Hotel } from "../../models/Hotel.js";

export class HotelService {
  async getAllHotels() {
    return await Hotel.find();
  }

  async getHotelById(id: string) {
    return await Hotel.findById(id);
  }

  async createHotel(data: any) {
    const hotel = new Hotel(data);
    return await hotel.save();
  }

  async updateHotel(id: string, data: any) {
    return await Hotel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteHotel(id: string) {
    return await Hotel.findByIdAndDelete(id);
  }

  async getPartnerHotels(ownerId: string) {
    return await Hotel.find({ ownerId });
  }

  async createPartnerHotel(data: any, ownerId: string) {
    const hotel = new Hotel({
      ...data,
      ownerId,
    });
    return await hotel.save();
  }

  async updatePartnerHotel(id: string, data: any, ownerId: string, isAdmin: boolean) {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return { status: 404, message: "Hotel not found" };
    }
    if (hotel.ownerId !== ownerId && !isAdmin) {
      return { status: 403, message: "Forbidden: Not the owner of this hotel" };
    }
    const updated = await Hotel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return { status: 200, data: updated };
  }

  async deletePartnerHotel(id: string, ownerId: string, isAdmin: boolean) {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return { status: 404, message: "Hotel not found" };
    }
    if (hotel.ownerId !== ownerId && !isAdmin) {
      return { status: 403, message: "Forbidden: Not the owner of this hotel" };
    }
    await Hotel.findByIdAndDelete(id);
    return { status: 200, message: "Hotel deleted successfully" };
  }
}

export const hotelService = new HotelService();
