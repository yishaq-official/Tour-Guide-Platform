import { servicesRepository, ServicesRepository } from "./services.repository.js";

export class HotelService {
  constructor(private repo: ServicesRepository = servicesRepository) {}

  async getAllHotels() {
    return await this.repo.getAllHotels();
  }

  async getHotelById(id: string) {
    return await this.repo.getHotelById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createHotel(data: any) {
    return await this.repo.createHotel(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateHotel(id: string, data: any) {
    return await this.repo.updateHotel(id, data);
  }

  async deleteHotel(id: string) {
    return await this.repo.deleteHotel(id);
  }

  async getPartnerHotels(ownerId: string) {
    return await this.repo.getHotelsByOwner(ownerId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createPartnerHotel(data: any, ownerId: string) {
    return await this.repo.createHotel({
      ...data,
      ownerId,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updatePartnerHotel(id: string, data: any, ownerId: string, isAdmin: boolean) {
    const hotel = await this.repo.getHotelById(id);
    if (!hotel) {
      return { status: 404, message: "Hotel not found" };
    }
    if (hotel.ownerId !== ownerId && !isAdmin) {
      return { status: 403, message: "Forbidden: Not the owner of this hotel" };
    }
    const updated = await this.repo.updateHotel(id, data);
    return { status: 200, data: updated };
  }

  async deletePartnerHotel(id: string, ownerId: string, isAdmin: boolean) {
    const hotel = await this.repo.getHotelById(id);
    if (!hotel) {
      return { status: 404, message: "Hotel not found" };
    }
    if (hotel.ownerId !== ownerId && !isAdmin) {
      return { status: 403, message: "Forbidden: Not the owner of this hotel" };
    }
    await this.repo.deleteHotel(id);
    return { status: 200, message: "Hotel deleted successfully" };
  }
}

export const hotelService = new HotelService();
