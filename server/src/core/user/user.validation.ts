import { z } from "zod";

export const toggleFavoriteSchema = z.object({
  itemId: z.string().min(1, "itemId is required"),
  itemModel: z.enum(["Heritage", "Culture", "Hotel", "Vehicle"]),
});

export const addToItinerarySchema = z.object({
  day: z.coerce.number().min(1, "Day must be at least 1"),
  itemId: z.string().min(1, "itemId is required"),
  itemModel: z.string().min(1, "itemModel is required"),
  notes: z.string().optional(),
});

export const syncItinerarySchema = z.object({
  itinerary: z.array(z.any()),
});

export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
export type AddToItineraryInput = z.infer<typeof addToItinerarySchema>;
export type SyncItineraryInput = z.infer<typeof syncItinerarySchema>;
