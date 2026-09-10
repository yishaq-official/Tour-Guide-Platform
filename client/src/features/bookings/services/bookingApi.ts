import { api } from "../../../core/api/client";
import { ENDPOINTS } from "../../../core/api/endpoints";

export const bookingApi = {
  createBooking: (data: any) => api.post<any>(ENDPOINTS.BOOK_SERVICE, data),
  getPartnerHotelBookings: () => api.get<any[]>(ENDPOINTS.PARTNER_HOTEL_BOOKINGS),
  getPartnerVehicleBookings: () => api.get<any[]>(ENDPOINTS.PARTNER_VEHICLE_BOOKINGS),
  updateBookingStatus: (id: string, status: "Pending" | "Confirmed" | "Cancelled") =>
    api.put<any>(ENDPOINTS.PARTNER_BOOKING_STATUS(id), { status }),
};
