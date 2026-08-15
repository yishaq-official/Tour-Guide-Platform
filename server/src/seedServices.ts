import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { Hotel } from "./models/Hotel.js";
import { Vehicle } from "./models/Vehicle.js";

const hotels = [
  {
    name: "Sheraton Addis, a Luxury Collection Hotel",
    description: "Located in the heart of the Ethiopian capital, Sheraton Addis features magnificent architecture, beautifully landscaped gardens, and a spectacular swimming pool. It offers unparalleled luxury and world-class service.",
    location: "Addis Ababa",
    rating: 4.8,
    pricePerNight: 250,
    image: "/images/sheraton.png",
    gallery: ["/images/sheraton.png", "/images/laketana.png", "/images/gondar_hills.png"],
    amenities: ["Free WiFi", "Outdoor Pool", "World-class Spa", "Fitness Center", "Multiple Restaurants", "Airport Shuttle", "Business Center"],
    coordinates: { lat: 9.0182, lng: 38.7525 },
    policies: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 48 hours before check-in."
    },
    roomTypes: [
      { name: "Classic Room, 1 King Bed", pricePerNight: 250, capacity: 2 },
      { name: "Club Level, 2 Twin Beds", pricePerNight: 320, capacity: 2 },
      { name: "Executive Suite", pricePerNight: 550, capacity: 4 }
    ]
  },
  {
    name: "Kuriftu Resort & Spa Bahir Dar",
    description: "Situated on the shores of Lake Tana, Kuriftu Resort offers traditional Ethiopian architecture with modern luxury, featuring a world-class spa and stunning lake views perfect for relaxation.",
    location: "Bahir Dar",
    rating: 4.6,
    pricePerNight: 180,
    image: "/images/laketana.png",
    gallery: ["/images/laketana.png", "/images/simien.png", "/images/lalibela.png"],
    amenities: ["Lake View", "Luxury Spa", "Free Breakfast", "Restaurant", "Boat Tours", "Swimming Pool"],
    coordinates: { lat: 11.5936, lng: 37.3908 },
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Non-refundable. Date changes permitted subject to availability."
    },
    roomTypes: [
      { name: "Standard Lake View", pricePerNight: 180, capacity: 2 },
      { name: "Premium Waterfront", pricePerNight: 240, capacity: 2 },
      { name: "Presidential Villa", pricePerNight: 450, capacity: 6 }
    ]
  },
  {
    name: "Gondar Hills Resort",
    description: "An eco-friendly resort overlooking the historic city of Gondar and its castles, combining sustainable design with premium comfort and breathtaking panoramic mountain views.",
    location: "Gondar",
    rating: 4.5,
    pricePerNight: 120,
    image: "/images/gondar_hills.png",
    gallery: ["/images/gondar_hills.png", "/images/harar.png", "/images/aksum.png"],
    amenities: ["Mountain View", "Restaurant", "Bar", "Free Parking", "Eco-friendly", "Terrace"],
    coordinates: { lat: 12.6075, lng: 37.4592 },
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before check-in."
    },
    roomTypes: [
      { name: "Standard Stone Room", pricePerNight: 120, capacity: 2 },
      { name: "Deluxe Mountain View", pricePerNight: 160, capacity: 3 }
    ]
  },
  {
    name: "Simien Lodge",
    description: "The highest lodge in Africa, offering breathtaking views of the Simien Mountains National Park and comfortable eco-friendly accommodations. Ideal for trekkers and nature lovers.",
    location: "Simien Mountains",
    rating: 4.7,
    pricePerNight: 140,
    image: "/images/simien.png",
    gallery: ["/images/simien.png", "/images/gondar.png", "/images/tiya.png"],
    amenities: ["Mountain View", "Bar", "Restaurant", "Heated Rooms", "Guided Tours", "Solar Power"],
    coordinates: { lat: 13.2333, lng: 38.0333 },
    policies: {
      checkIn: "1:00 PM",
      checkOut: "10:00 AM",
      cancellation: "Strict: 50% refund up to 7 days before check-in."
    },
    roomTypes: [
      { name: "Standard Tukel", pricePerNight: 140, capacity: 2 },
      { name: "Family Tukel", pricePerNight: 200, capacity: 4 }
    ]
  },
  {
    name: "Haile Resort Awassa",
    description: "A luxury family resort located on the shores of Lake Awassa, featuring exceptional recreational facilities, mini-golf, horseback riding, and a world-class spa.",
    location: "Awassa",
    rating: 4.6,
    pricePerNight: 160,
    image: "/images/laketana.png",
    gallery: ["/images/laketana.png", "/images/omo.png", "/images/awash.png"],
    amenities: ["Lake View", "Pool", "Spa", "Mini Golf", "Family Friendly", "Horse Riding"],
    coordinates: { lat: 7.0504, lng: 38.4768 },
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 3 days before check-in."
    },
    roomTypes: [
      { name: "Standard Double", pricePerNight: 160, capacity: 2 },
      { name: "Family Suite", pricePerNight: 280, capacity: 5 }
    ]
  },
  {
    name: "Lal Hotel & Spa",
    description: "A comfortable and centrally located hotel in Lalibela, perfect as a base for exploring the ancient rock-hewn churches with excellent hospitality.",
    location: "Lalibela",
    rating: 4.3,
    pricePerNight: 85,
    image: "/images/lalibela.png",
    gallery: ["/images/lalibela.png", "/images/gondar_hills.png", "/images/sheraton.png"],
    amenities: ["Free WiFi", "Restaurant", "Airport Shuttle", "Bar", "Tour Desk"],
    coordinates: { lat: 12.0333, lng: 39.0333 },
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in."
    },
    roomTypes: [
      { name: "Standard Twin", pricePerNight: 85, capacity: 2 },
      { name: "Standard King", pricePerNight: 95, capacity: 2 }
    ]
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
