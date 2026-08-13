import {mongodbAdapter} from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

const db = client.db("travelAssist")


export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    EmailAndPassword:{
        enabled: true,
    },
    trustedOrigins: [
        "http://localhost:5173",
        "http://localhost:5174"
    ]
})