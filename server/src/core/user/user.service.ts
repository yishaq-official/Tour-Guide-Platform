import { userRepository, UserRepository } from "./user.repository.js";
import { NotFoundError } from "../../common/errors/NotFoundError.js";
import { BadRequestError } from "../../common/errors/BadRequestError.js";

export class UserService {
  constructor(private repo: UserRepository = userRepository) {}

  async getFavorites(userId: string) {
    const data = await this.repo.getOrCreateTripData(userId);
    return data.favorites;
  }

  async toggleFavorite(userId: string, itemId: string, itemModel: "Heritage" | "Culture" | "Hotel" | "Vehicle") {
    const data = await this.repo.getOrCreateTripData(userId);
    const existingIndex = data.favorites.findIndex(
      (f) => f.itemId && f.itemId._id?.toString() === itemId
    );

    if (existingIndex > -1) {
      data.favorites.splice(existingIndex, 1);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.favorites.push({ itemId, itemModel } as any);
    }

    await data.save();
    await data.populate("favorites.itemId");
    return data.favorites;
  }

  async getItinerary(userId: string) {
    const data = await this.repo.getOrCreateTripData(userId);
    return data.itinerary;
  }

  async addToItinerary(
    userId: string,
    payload: { day: number; itemId: string; itemModel: string; notes?: string }
  ) {
    const data = await this.repo.getOrCreateTripData(userId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.itinerary.push(payload as any);
    await data.save();
    await data.populate("itinerary.itemId");
    return data.itinerary;
  }

  async removeFromItinerary(userId: string, itineraryItemId: string) {
    const data = await this.repo.getOrCreateTripData(userId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.itinerary = data.itinerary.filter(
      (item) => item._id?.toString() !== itineraryItemId
    ) as any;
    await data.save();
    return data.itinerary;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async syncItinerary(userId: string, itinerary: any[]) {
    if (!Array.isArray(itinerary)) {
      throw new BadRequestError("Itinerary must be an array");
    }
    const data = await this.repo.getOrCreateTripData(userId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.itinerary = itinerary as any;
    await data.save();
    await data.populate("itinerary.itemId");
    return data.itinerary;
  }

  async getUserBookings(userId: string) {
    return await this.repo.getUserBookings(userId);
  }

  async cancelBooking(userId: string, bookingId: string) {
    const booking = await this.repo.findUserBooking(bookingId, userId);
    if (!booking) {
      throw new NotFoundError("Booking not found or unauthorized");
    }
    booking.status = "Cancelled";
    await booking.save();
    return booking;
  }
}

export const userService = new UserService();
