import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String }, // Better-Auth uses string IDs
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemModel' },
  itemModel: { type: String, required: true, enum: ['Hotel', 'Vehicle'] },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true, default: 1 },
  roomType: { type: String },
  specialRequests: { type: String },
  pickupLocation: { type: String },
  dropoffLocation: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);
