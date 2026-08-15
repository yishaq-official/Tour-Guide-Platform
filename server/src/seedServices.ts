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
    image: "/images/sheraton.png",
    amenities: ["Free WiFi", "Pool", "Spa", "Fitness Center", "Restaurant"]
  },
  {
    name: "Kuriftu Resort & Spa Bahir Dar",
    description: "Situated on the shores of Lake Tana, Kuriftu Resort offers traditional Ethiopian architecture with modern luxury, featuring a world-class spa and stunning lake views.",
    location: "Bahir Dar",
    rating: 4.6,
    pricePerNight: 180,
    image: "/images/laketana.png",
    amenities: ["Lake View", "Spa", "Free Breakfast", "Restaurant"]
  },
  {
    name: "Gondar Hills Resort",
    description: "An eco-friendly resort overlooking the historic city of Gondar and its castles, combining sustainable design with premium comfort.",
    location: "Gondar",
    rating: 4.5,
    pricePerNight: 120,
    image: "/images/gondar_hills.png",
    amenities: ["Mountain View", "Restaurant", "Bar", "Free Parking"]
  },
  {
    name: "Simien Lodge",
    description: "The highest lodge in Africa, offering breathtaking views of the Simien Mountains National Park and comfortable eco-friendly accommodations.",
    location: "Simien Mountains",
    rating: 4.7,
    pricePerNight: 140,
    image: "/images/simien.png",
    amenities: ["Mountain View", "Bar", "Restaurant", "Heated Rooms", "Guided Tours"]
  },
  {
    name: "Haile Resort Awassa",
    description: "A luxury family resort located on the shores of Lake Awassa, featuring exceptional recreational facilities, mini-golf, and a world-class spa.",
    location: "Awassa",
    rating: 4.6,
    pricePerNight: 160,
    image: "/images/laketana.png",
    amenities: ["Lake View", "Pool", "Spa", "Mini Golf", "Family Friendly"]
  },
  {
    name: "Lal Hotel & Spa",
    description: "A comfortable and centrally located hotel in Lalibela, perfect as a base for exploring the ancient rock-hewn churches.",
    location: "Lalibela",
    rating: 4.3,
    pricePerNight: 85,
    image: "/images/lalibela.png",
    amenities: ["Free WiFi", "Restaurant", "Airport Shuttle", "Bar"]
  }
];

const vehicles = [
  {
    name: "Toyota Land Cruiser V8",
    type: "SUV",
    transmission: "Automatic",
    seats: 7,
    pricePerDay: 150,
    image: "/images/landcruiser.png",
    available: true
  },
  {
    name: "Toyota Corolla",
    type: "Sedan",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 60,
    image: "/images/corolla.png",
    available: true
  },
  {
    name: "Toyota HiAce Minibus",
    type: "Minivan",
    transmission: "Manual",
    seats: 12,
    pricePerDay: 100,
    image: "/images/hiace.png",
    available: true
  },
  {
    name: "Nissan Patrol 4x4",
    type: "SUV",
    transmission: "Automatic",
    seats: 7,
    pricePerDay: 170,
    image: "/images/landcruiser.png",
    available: true
  },
  {
    name: "Hyundai Tucson",
    type: "SUV",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 85,
    image: "/images/corolla.png",
    available: true
  },
  {
    name: "Suzuki Swift",
    type: "Sedan",
    transmission: "Manual",
    seats: 4,
    pricePerDay: 45,
    image: "/images/corolla.png",
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
