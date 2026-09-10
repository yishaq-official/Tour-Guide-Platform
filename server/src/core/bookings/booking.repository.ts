import { Booking } from "../../models/Booking.js";
import { Hotel } from "../../models/Hotel.js";
import { Vehicle } from "../../models/Vehicle.js";

export class BookingRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createBooking(data: any) {
    const booking = new Booking(data);
    return await booking.save();
  }

  async findBookingById(id: string) {
    return await Booking.findById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findHotelBookings(hotelIds: any[]) {
    return await Booking.find({ itemId: { $in: hotelIds }, itemModel: "Hotel" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findVehicleBookings(vehicleIds: any[]) {
    return await Booking.find({ itemId: { $in: vehicleIds }, itemModel: "Vehicle" });
  }

  async findHotelsByOwner(ownerId: string) {
    return await Hotel.find({ ownerId });
  }

  async findVehiclesByOwner(ownerId: string) {
    return await Vehicle.find({ ownerId });
  }

  async findHotelById(id: string) {
    return await Hotel.findById(id);
  }

  async findVehicleById(id: string) {
    return await Vehicle.findById(id);
  }
}

export const bookingRepository = new BookingRepository();
