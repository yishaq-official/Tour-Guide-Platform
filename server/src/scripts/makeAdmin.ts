import mongoose from "mongoose";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide a user email. Example: npx tsx src/scripts/makeAdmin.ts admin@example.com");
    process.exit(1);
  }

  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database not connected");
    }

    const userCollection = db.collection("user");
    const user = await userCollection.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      mongoose.connection.close();
      process.exit(1);
    }

    const result = await userCollection.updateOne(
      { email },
      { $set: { role: "admin" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Successfully updated ${email} to admin!`);
    } else {
      console.log(`${email} is already an admin or role was not modified.`);
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error setting admin role:", error);
    process.exit(1);
  }
};

makeAdmin();
