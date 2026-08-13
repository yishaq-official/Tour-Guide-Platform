import mongoose from "mongoose";

const cultureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  history: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isUnesco: {
    type: Boolean,
    default: true,
  },
  quickFacts: { type: Object },
  culturalHighlights: [{
    title: String,
    description: String
  }],
  travelerExperience: [{ type: String }]
}, { timestamps: true });

export const Culture = mongoose.model("Culture", cultureSchema);
