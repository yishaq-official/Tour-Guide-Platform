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
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Sheraton_Addis.jpg", // Fair use placeholder
    amenities: ["Free WiFi", "Pool", "Spa", "Fitness Center", "Restaurant"]
  },
  {
    name: "Kuriftu Resort & Spa Bahir Dar",
    description: "Situated on the shores of Lake Tana, Kuriftu Resort offers traditional Ethiopian architecture with modern luxury, featuring a world-class spa and stunning lake views.",
    location: "Bahir Dar",
    rating: 4.6,
    pricePerNight: 180,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Lake_Tana_Bahir_Dar_Ethiopia.jpg", // Fair use placeholder
    amenities: ["Lake View", "Spa", "Free Breakfast", "Restaurant"]
  },
  {
    name: "Gondar Hills Resort",
    description: "An eco-friendly resort overlooking the historic city of Gondar and its castles, combining sustainable design with premium comfort.",
    location: "Gondar",
    rating: 4.5,
    pricePerNight: 120,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Fasil_Ghebbi%2C_Gondar%2C_Ethiopia.jpg", // Fair use placeholder
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
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/2016_Toyota_Land_Cruiser_%28VDJ200R%29_Sahara_wagon_%282018-08-06%29_01.jpg",
    available: true
  },
  {
    name: "Toyota Corolla",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 60,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/2019_Toyota_Corolla_Icon_Tech_HEV_CVT_1.8.jpg",
    available: true
  },
  {
    name: "Toyota HiAce Minibus",
    type: "Minivan",
    transmission: "Manual",
    seats: 12,
    pricePerDay: 100,
    image: "https://upload.wikimedia.org/wikipedia/commons/0/07/2017_Toyota_HiAce_%28TRH223R%29_Commuter_van_%282018-10-01%29_01.jpg",
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
