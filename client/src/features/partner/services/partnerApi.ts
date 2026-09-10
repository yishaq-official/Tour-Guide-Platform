import { api } from "../../../core/api/client";
import { ENDPOINTS } from "../../../core/api/endpoints";

export const partnerApi = {
  // Hotels
  getPartnerHotels: () => api.get<any[]>(`${ENDPOINTS.SERVICES}/partner/hotels`),
  createPartnerHotel: (data: any) => api.post<any>(`${ENDPOINTS.SERVICES}/partner/hotels`, data),
  updatePartnerHotel: (id: string, data: any) =>
    api.put<any>(`${ENDPOINTS.SERVICES}/partner/hotels/${id}`, data),
  deletePartnerHotel: (id: string) =>
    api.delete<any>(`${ENDPOINTS.SERVICES}/partner/hotels/${id}`),

  // Vehicles
  getPartnerVehicles: () => api.get<any[]>(`${ENDPOINTS.SERVICES}/partner/vehicles`),
  createPartnerVehicle: (data: any) => api.post<any>(`${ENDPOINTS.SERVICES}/partner/vehicles`, data),
  updatePartnerVehicle: (id: string, data: any) =>
    api.put<any>(`${ENDPOINTS.SERVICES}/partner/vehicles/${id}`, data),
  deletePartnerVehicle: (id: string) =>
    api.delete<any>(`${ENDPOINTS.SERVICES}/partner/vehicles/${id}`),

  // Reservations
  getPartnerHotelReservations: () =>
    api.get<any[]>(`${ENDPOINTS.BOOKINGS}/partner/bookings`),
  getPartnerVehicleReservations: () =>
    api.get<any[]>(`${ENDPOINTS.BOOKINGS}/partner/vehicle-bookings`),
  updateReservationStatus: (id: string, status: "Pending" | "Confirmed" | "Cancelled") =>
    api.put<any>(ENDPOINTS.BOOKING_STATUS(id), { status }),
};
