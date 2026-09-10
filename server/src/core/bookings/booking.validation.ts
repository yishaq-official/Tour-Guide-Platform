import { z } from "zod";

export const createBookingSchema = z.object({
  itemId: z.string().min(1, "itemId is required"),
  itemModel: z.enum(["Hotel", "Vehicle"]),
  customerName: z.string().min(1, "customerName is required"),
  customerEmail: z.string().email("Valid customerEmail is required"),
  phone: z.string().min(1, "phone is required"),
  startDate: z.string().min(1, "startDate is required"),
  endDate: z.string().min(1, "endDate is required"),
  totalPrice: z.coerce.number().min(0, "totalPrice must be positive"),
  guests: z.coerce.number().min(1).optional(),
  roomType: z.string().optional(),
  specialRequests: z.string().optional(),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  userId: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Cancelled"]),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
