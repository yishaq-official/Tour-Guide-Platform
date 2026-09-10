import { api } from "../../../core/api/client";
import { ENDPOINTS } from "../../../core/api/endpoints";

export const bookingApi = {
  createBooking: (data: any) => api.post<any>(`${ENDPOINTS.BOOKINGS}/book`, data),
  getPartnerHotelBookings: () => api.get<any[]>(`${ENDPOINTS.BOOKINGS}/partner/bookings`),
  getPartnerVehicleBookings: () => api.get<any[]>(`${ENDPOINTS.BOOKINGS}/partner/vehicle-bookings`),
  updateBookingStatus: (id: string, status: "Pending" | "Confirmed" | "Cancelled") =>
    api.put<any>(ENDPOINTS.BOOKING_STATUS(id), { status }),
};
