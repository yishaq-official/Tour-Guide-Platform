import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { Heritage } from "./models/Heritage.js";

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const heritages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'heritagesData.json'), 'utf-8'));

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing heritages
    await Heritage.deleteMany({});
    console.log("Cleared existing heritages.");

    // Insert new ones
    await Heritage.insertMany(heritages);
    console.log("Successfully seeded UNESCO Heritages!");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
