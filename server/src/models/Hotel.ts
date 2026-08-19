import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  amenities: [{ type: String }],
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  policies: {
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    cancellation: { type: String, required: true }
  },
  roomTypes: [{
    name: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, required: true },
    image: { type: String, required: false }
  }],
}, { timestamps: true });

export const Hotel = mongoose.model("Hotel", hotelSchema);
