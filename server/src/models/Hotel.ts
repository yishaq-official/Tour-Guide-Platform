import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  image: { type: String, required: true },
  amenities: [{ type: String }],
}, { timestamps: true });

export const Hotel = mongoose.model("Hotel", hotelSchema);
