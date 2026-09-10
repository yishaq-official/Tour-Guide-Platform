import { bookingRepository, BookingRepository } from "./booking.repository.js";

export interface CreateBookingDTO {
  itemId: string;
  itemModel: "Hotel" | "Vehicle";
  customerName: string;
  customerEmail: string;
  phone: string;
  guests?: number;
  roomType?: string;
  specialRequests?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  startDate: string | Date;
  endDate: string | Date;
  totalPrice: number;
  userId?: string;
}

export class BookingService {
  constructor(private repo: BookingRepository = bookingRepository) {}

  async createBooking(data: CreateBookingDTO) {
    const {
      itemId,
      itemModel,
      customerName,
      customerEmail,
      phone,
      startDate,
      endDate,
      totalPrice,
      guests,
      roomType,
      specialRequests,
      pickupLocation,
      dropoffLocation,
      userId,
    } = data;

    if (!itemId || !itemModel || !customerName || !customerEmail || !phone || !startDate || !endDate || !totalPrice) {
      return {
        status: 400,
        message:
          "All fields are required (itemId, itemModel, customerName, customerEmail, phone, startDate, endDate, totalPrice)",
      };
    }

    const newBooking = await this.repo.createBooking({
      itemId,
      itemModel,
      customerName,
      customerEmail,
      phone,
      guests: guests || 1,
      roomType,
      specialRequests,
      pickupLocation,
      dropoffLocation,
      startDate,
      endDate,
      totalPrice,
      userId,
    });

    return { status: 201, data: newBooking };
  }

  async getPartnerHotelBookings(ownerId: string) {
    const hotels = await this.repo.findHotelsByOwner(ownerId);
    const hotelIds = hotels.map((h) => h._id);
    return await this.repo.findHotelBookings(hotelIds);
  }

  async getPartnerVehicleBookings(ownerId: string) {
    const vehicles = await this.repo.findVehiclesByOwner(ownerId);
    const vehicleIds = vehicles.map((v) => v._id);
    return await this.repo.findVehicleBookings(vehicleIds);
  }

  async updateBookingStatus(
    id: string,
    status: "Pending" | "Confirmed" | "Cancelled",
    user: { id: string; role: string }
  ) {
    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return { status: 400, message: "Invalid status" };
    }

    const booking = await this.repo.findBookingById(id);
    if (!booking) {
      return { status: 404, message: "Booking not found" };
    }

    if (user.role !== "admin") {
      if (booking.itemModel === "Hotel") {
        const hotel = await this.repo.findHotelById(booking.itemId.toString());
        if (!hotel || hotel.ownerId !== user.id) {
          return { status: 403, message: "Forbidden: Not authorized to manage bookings for this hotel" };
        }
      } else if (booking.itemModel === "Vehicle") {
        const vehicle = await this.repo.findVehicleById(booking.itemId.toString());
        if (!vehicle || vehicle.ownerId !== user.id) {
          return { status: 403, message: "Forbidden: Not authorized to manage bookings for this vehicle" };
        }
      } else {
        return { status: 403, message: "Forbidden: Not authorized to manage this booking" };
      }
    }


    booking.status = status;
    await booking.save();
    return { status: 200, data: booking };
  }
}

export const bookingService = new BookingService();
