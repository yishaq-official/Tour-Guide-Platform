import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Toyota Land Cruiser"
  type: { type: String, required: true, enum: ["SUV", "Sedan", "Minivan"] },
  transmission: { type: String, required: true, enum: ["Automatic", "Manual"] },
  seats: { type: Number, required: true },
  pricePerDay: { type: Number, required: true }, // In USD or Birr
  image: { type: String, required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
