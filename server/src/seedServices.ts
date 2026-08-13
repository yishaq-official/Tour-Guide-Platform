import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { Hotel } from "./models/Hotel.js";
import { Vehicle } from "./models/Vehicle.js";

const hotels = [
  {
    name: "Sheraton Addis, a Luxury Collection Hotel",
    description: "Located in the heart of the Ethiopian capital, Sheraton Addis features magnificent architecture, beautifully landscaped gardens, and a spectacular swimming pool. It offers unparalleled luxury.",
    location: "Addis Ababa",
    rating: 4.8,
    pricePerNight: 250,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    amenities: ["Free WiFi", "Pool", "Spa", "Fitness Center", "Restaurant"]
  },
  {
    name: "Kuriftu Resort & Spa Bahir Dar",
    description: "Situated on the shores of Lake Tana, Kuriftu Resort offers traditional Ethiopian architecture with modern luxury, featuring a world-class spa and stunning lake views.",
    location: "Bahir Dar",
    rating: 4.6,
    pricePerNight: 180,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    amenities: ["Lake View", "Spa", "Free Breakfast", "Restaurant"]
  },
  {
    name: "Gondar Hills Resort",
    description: "An eco-friendly resort overlooking the historic city of Gondar and its castles, combining sustainable design with premium comfort.",
    location: "Gondar",
    rating: 4.5,
    pricePerNight: 120,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    amenities: ["Mountain View", "Restaurant", "Bar", "Free Parking"]
  }
];

const vehicles = [
  {
    name: "Toyota Land Cruiser V8",
    type: "SUV",
    transmission: "Automatic",
    seats: 7,
    pricePerDay: 150,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    available: true
  },
  {
    name: "Toyota Corolla",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 60,
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80",
    available: true
  },
  {
    name: "Toyota HiAce Minibus",
    type: "Minivan",
    transmission: "Manual",
    seats: 12,
    pricePerDay: 100,
    image: "https://images.unsplash.com/photo-1619864708764-da6017bb529f?auto=format&fit=crop&w=800&q=80",
    available: true
  }
];

const seedServices = async () => {
  try {
    await connectDB();
    
    await Hotel.deleteMany({});
    await Vehicle.deleteMany({});
    console.log("Cleared existing services.");

    await Hotel.insertMany(hotels);
    await Vehicle.insertMany(vehicles);
    console.log("Successfully seeded Hotels and Vehicles!");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedServices();
