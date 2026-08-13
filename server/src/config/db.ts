import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const uri = process.env.MONGODB_URI!;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectDB;