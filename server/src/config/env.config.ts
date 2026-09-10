import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().min(1, "Valid MONGODB_URI is required"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  BETTER_AUTH_SECRET: z.string().min(10, "BETTER_AUTH_SECRET must be at least 10 characters"),
  BETTER_AUTH_URL: z.string().default("http://localhost:5000"),
  AI_PROVIDER: z.enum(["gemini", "openai", "mock"]).default("mock"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export type EnvConfig = z.infer<typeof envSchema>;
