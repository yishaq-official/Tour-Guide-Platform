export type TabType = "hotels" | "vehicles" | "reservations";

export interface RoomType {
  name: string;
  pricePerNight: number;
  capacity: number;
  image: string;
}

export interface HotelFormData {
  name: string;
  description: string;
  location: string;
  rating: number;
  pricePerNight: number;
  image: string;
  galleryRaw: string;
  amenitiesRaw: string;
  lat: number;
  lng: number;
  checkIn: string;
  checkOut: string;
  cancellation: string;
  roomTypes: RoomType[];
}

export interface VehicleFormData {
  name: string;
  type: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  image: string;
  galleryRaw: string;
  description: string;
  providerName: string;
  providerPhone: string;
  featuresRaw: string;
  policyMileage: string;
  policyFuel: string;
  policyCancellation: string;
}

export interface PartnerMetrics {
  totalListings: number;
  activeReservations: number;
  totalEstimatedRevenue: number;
  avgRating: number;
}
