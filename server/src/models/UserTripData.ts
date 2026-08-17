import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'favorites.itemModel' },
  itemModel: { type: String, required: true, enum: ['Heritage', 'Culture', 'Hotel', 'Vehicle'] },
  addedAt: { type: Date, default: Date.now }
});

const itineraryItemSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itinerary.itemModel' },
  itemModel: { type: String, required: true, enum: ['Heritage', 'Culture', 'Hotel', 'Vehicle'] },
  notes: { type: String }
});

const userTripDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Better-Auth user ID
  favorites: [favoriteSchema],
  itinerary: [itineraryItemSchema]
}, { timestamps: true });

export const UserTripData = mongoose.model("UserTripData", userTripDataSchema);
