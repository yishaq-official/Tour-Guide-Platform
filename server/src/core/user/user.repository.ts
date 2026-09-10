import { UserTripData } from "../../models/UserTripData.js";
import { Booking } from "../../models/Booking.js";

export class UserRepository {
  async getOrCreateTripData(userId: string) {
    let data = await UserTripData.findOne({ userId })
      .populate("favorites.itemId")
      .populate("itinerary.itemId");

    if (!data) {
      data = await UserTripData.create({ userId, favorites: [], itinerary: [] });
    }
    return data;
  }

  async getUserBookings(userId: string) {
    return await Booking.find({ userId }).populate("itemId");
  }

  async findUserBooking(bookingId: string, userId: string) {
    return await Booking.findOne({ _id: bookingId, userId });
  }
}

export const userRepository = new UserRepository();
