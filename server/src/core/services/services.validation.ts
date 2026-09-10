import { z } from "zod";

export const hotelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().optional(),
  pricePerNight: z.coerce.number().min(0, "Price must be non-negative"),
  rating: z.coerce.number().min(0).max(5).optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  description: z.string().optional(),
  roomTypes: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        capacity: z.number().optional(),
        amenities: z.array(z.string()).optional(),
        image: z.string().optional(),
      })
    )
    .optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const vehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  pricePerDay: z.coerce.number().min(0, "Price per day must be non-negative"),
  driverIncluded: z.boolean().optional(),
  image: z.string().optional(),
  features: z.array(z.string()).optional(),
  available: z.boolean().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export type HotelInput = z.infer<typeof hotelSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
