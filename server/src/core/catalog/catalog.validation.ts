import { z } from "zod";

export const heritageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  region: z.string().min(1, "Region is required"),
  image: z.string().optional(),
  history: z.string().optional(),
  isUnesco: z.boolean().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  quickFacts: z.record(z.string()).optional(),
  highlights: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .optional(),
});

export const cultureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  history: z.string().min(1, "History is required"),
  location: z.string().min(1, "Location is required"),
  image: z.string().optional(),
  isUnesco: z.boolean().optional(),
  quickFacts: z.record(z.string()).optional(),
  culturalHighlights: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .optional(),
  travelerExperience: z.array(z.string()).optional(),
});

export type HeritageInput = z.infer<typeof heritageSchema>;
export type CultureInput = z.infer<typeof cultureSchema>;
