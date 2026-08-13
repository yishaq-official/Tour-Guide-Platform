import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { Culture } from "./models/Culture.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cultures = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'culturesData.json'), 'utf-8'));

const seedData = async () => {
  try {
    await connectDB();
    
    await Culture.deleteMany({});
    console.log("Cleared existing cultures.");

    await Culture.insertMany(cultures);
    console.log("Successfully seeded UNESCO Cultures!");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
