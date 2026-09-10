export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ENDPOINTS = {
  // Catalog
  HERITAGES: `${API_BASE_URL}/heritages`,
  HERITAGE_BY_ID: (id: string) => `${API_BASE_URL}/heritages/${id}`,
  CULTURES: `${API_BASE_URL}/cultures`,
  CULTURE_BY_ID: (id: string) => `${API_BASE_URL}/cultures/${id}`,

  // Services
  SERVICES: `${API_BASE_URL}/services`,
  HOTELS: `${API_BASE_URL}/services/hotels`,
  HOTEL_BY_ID: (id: string) => `${API_BASE_URL}/services/hotels/${id}`,
  VEHICLES: `${API_BASE_URL}/services/vehicles`,
  VEHICLE_BY_ID: (id: string) => `${API_BASE_URL}/services/vehicles/${id}`,

  // Bookings
  BOOKINGS: `${API_BASE_URL}/services/bookings`,
  BOOKINGS_MY: `${API_BASE_URL}/services/bookings/my`,
  BOOKING_STATUS: (id: string) => `${API_BASE_URL}/services/bookings/${id}/status`,

  // User Trip Data
  USER_FAVORITES: `${API_BASE_URL}/user/favorites`,
  USER_ITINERARY: `${API_BASE_URL}/user/itinerary`,
  USER_ITINERARY_ITEM: (itemId: string) => `${API_BASE_URL}/user/itinerary/${itemId}`,
  USER_BOOKINGS: `${API_BASE_URL}/user/bookings`,

  // AI & RAG Subsystem
  AI_QUERY: `${API_BASE_URL}/rag/query`,
} as const;
