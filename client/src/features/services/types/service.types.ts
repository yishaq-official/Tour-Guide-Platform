export interface RoomType {
  name: string;
  pricePerNight: number;
  capacity: number;
  image?: string;
}

export interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  pricePerNight: number;
  image: string;
  gallery: string[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  roomTypes: RoomType[];
}

export interface Provider {
  name: string;
  rating: number;
  phone: string;
}

export interface VehiclePolicies {
  mileage: string;
  fuel: string;
  cancellation: string;
}

export interface Vehicle {
  _id: string;
  name: string;
  type: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  image: string;
  gallery?: string[];
  description?: string;
  provider?: Provider;
  features?: string[];
  policies?: VehiclePolicies;
  available: boolean;
}
