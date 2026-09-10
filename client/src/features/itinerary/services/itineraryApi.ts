import { api } from "../../../core/api/client";
import { ENDPOINTS } from "../../../core/api/endpoints";

export const itineraryApi = {
  getFavorites: () => api.get<any[]>(ENDPOINTS.USER_FAVORITES),
  toggleFavorite: (itemId: string, itemModel: "Heritage" | "Culture" | "Hotel" | "Vehicle") =>
    api.post<any[]>(ENDPOINTS.USER_FAVORITES, { itemId, itemModel }),
  getItinerary: () => api.get<any[]>(ENDPOINTS.USER_ITINERARY),
  addToItinerary: (payload: { day: number; itemId: string; itemModel: string; notes?: string }) =>
    api.post<any[]>(ENDPOINTS.USER_ITINERARY, payload),
  removeFromItinerary: (itineraryItemId: string) =>
    api.delete<any[]>(ENDPOINTS.USER_ITINERARY_ITEM(itineraryItemId)),
  syncItinerary: (itinerary: any[]) =>
    api.put<any[]>(`${ENDPOINTS.USER_ITINERARY}/sync`, { itinerary }),
  getUserBookings: () => api.get<any[]>(ENDPOINTS.USER_BOOKINGS),
  cancelBooking: (bookingId: string) =>
    api.put<any>(`${ENDPOINTS.USER_BOOKINGS}/${bookingId}/cancel`),
};
