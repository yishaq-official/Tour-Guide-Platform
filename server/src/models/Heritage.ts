import mongoose from "mongoose";

const heritageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  history: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  image: {
    type: String,
    required: true,
  },
  isUnesco: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
    enum: ["Historical", "Natural", "Cultural", "Archaeological"],
  }
}, { timestamps: true });

export const Heritage = mongoose.model("Heritage", heritageSchema);
