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
    emailAndPassword:{
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
    trustedOrigins: [
        "http://localhost:5173",
        "http://localhost:5174"
    ]
})