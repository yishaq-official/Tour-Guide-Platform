import { api } from "../../../core/api/client";
import { ENDPOINTS } from "../../../core/api/endpoints";

export const servicesApi = {
  // Hotels
  getHotels: () => api.get<any[]>(ENDPOINTS.HOTELS),
  getHotelById: (id: string) => api.get<any>(ENDPOINTS.HOTEL_BY_ID(id)),
  createHotel: (data: any) => api.post<any>(ENDPOINTS.HOTELS, data),
  updateHotel: (id: string, data: any) => api.put<any>(ENDPOINTS.HOTEL_BY_ID(id), data),
  deleteHotel: (id: string) => api.delete<any>(ENDPOINTS.HOTEL_BY_ID(id)),

  // Vehicles
  getVehicles: () => api.get<any[]>(ENDPOINTS.VEHICLES),
  getVehicleById: (id: string) => api.get<any>(ENDPOINTS.VEHICLE_BY_ID(id)),
  createVehicle: (data: any) => api.post<any>(ENDPOINTS.VEHICLES, data),
  updateVehicle: (id: string, data: any) => api.put<any>(ENDPOINTS.VEHICLE_BY_ID(id), data),
  deleteVehicle: (id: string) => api.delete<any>(ENDPOINTS.VEHICLE_BY_ID(id)),
};
