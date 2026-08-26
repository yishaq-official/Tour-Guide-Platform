import type { Request, Response } from "express";
import { Heritage } from "../models/Heritage.js";
import { Culture } from "../models/Culture.js";
import { Hotel } from "../models/Hotel.js";
import { Vehicle } from "../models/Vehicle.js";

/**
 * RAG (Retrieval-Augmented Generation) Travel Assistant Controller
 * 
 * TODO for Production Vector RAG Integration:
 * 1. Generate text embeddings for incoming `req.body.query` using OpenAI / HuggingFace embeddings API.
 * 2. Query vector database (ChromaDB / Pinecone / Qdrant) for nearest neighbor chunks in knowledge documents.
 * 3. Pass retrieved context chunks + prompt to LLM (OpenAI GPT-4o / Gemini 1.5 Pro) to generate final answer stream.
 */
export const queryRAGSystem = async (req: Request, res: Response) => {
  try {
    const { query, contextSiteId, contextType } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query string is required" });
    }

    const cleanQuery = query.trim().toLowerCase();

    // 1. RETRIEVAL PHASE: Search Heritage and Culture collections
    let matchedHeritages: any[] = [];
    let matchedCultures: any[] = [];

    if (contextSiteId) {
      if (contextType === "culture") {
        const culture = await Culture.findById(contextSiteId);
        if (culture) matchedCultures.push(culture);
      } else {
        const heritage = await Heritage.findById(contextSiteId);
        if (heritage) matchedHeritages.push(heritage);
      }
    }

    // Keyword search across heritage names, history, descriptions, and regions
    const heritageKeywordMatches = await Heritage.find({
      $or: [
        { name: { $regex: cleanQuery, $options: "i" } },
        { region: { $regex: cleanQuery, $options: "i" } },
        { location: { $regex: cleanQuery, $options: "i" } },
        { description: { $regex: cleanQuery, $options: "i" } },
        { history: { $regex: cleanQuery, $options: "i" } },
      ],
    }).limit(3);

    // Keyword search across culture items
    const cultureKeywordMatches = await Culture.find({
      $or: [
        { name: { $regex: cleanQuery, $options: "i" } },
        { location: { $regex: cleanQuery, $options: "i" } },
        { history: { $regex: cleanQuery, $options: "i" } },
      ],
    }).limit(3);

    // Combine and deduplicate
    const allHeritagesMap = new Map();
    [...matchedHeritages, ...heritageKeywordMatches].forEach((item) =>
      allHeritagesMap.set(item._id.toString(), item)
    );
    matchedHeritages = Array.from(allHeritagesMap.values());

    const allCulturesMap = new Map();
    [...matchedCultures, ...cultureKeywordMatches].forEach((item) =>
      allCulturesMap.set(item._id.toString(), item)
    );
    matchedCultures = Array.from(allCulturesMap.values());

    // If no direct keyword match, grab top featured heritages as general context fallback
    if (matchedHeritages.length === 0 && matchedCultures.length === 0) {
      matchedHeritages = await Heritage.find({ isUnesco: true }).limit(2);
    }

    // 2. NEARBY SERVICES RETRIEVAL PHASE: Match hotels and vehicles near target locations
    const primaryLocation =
      matchedHeritages[0]?.location ||
      matchedHeritages[0]?.region ||
      matchedCultures[0]?.location ||
      "Gondar";

    // Extract city name (e.g. "Lalibela", "Gondar", "Addis Ababa", "Aksum")
    const cityNameMatch = primaryLocation.match(/(Lalibela|Gondar|Aksum|Harar|Addis Ababa|Bahir Dar|Omo|Awash|Tiya|Simien)/i);
    const cityName = cityNameMatch ? cityNameMatch[0] : "";

    let recommendedHotels: any[] = [];
    if (cityName) {
      recommendedHotels = await Hotel.find({
        location: { $regex: cityName, $options: "i" },
      }).limit(3);
    }
    if (recommendedHotels.length === 0) {
      recommendedHotels = await Hotel.find().limit(2);
    }

    let recommendedVehicles = await Vehicle.find({ available: true }).limit(2);

    // 3. GENERATION PHASE: Synthesize RAG Answer Narrative
    let answerText = "";
    const primarySite = matchedHeritages[0] || matchedCultures[0];

    if (cleanQuery.includes("hotel") || cleanQuery.includes("stay") || cleanQuery.includes("recommend")) {
      answerText = `Based on your request regarding accommodations near **${primarySite?.name || "top Ethiopian destinations"}**, we retrieved **${recommendedHotels.length} top-rated hotels** nearby. ${recommendedHotels[0] ? `${recommendedHotels[0].name} in ${recommendedHotels[0].location} offers great hospitality starting at $${recommendedHotels[0].pricePerNight}/night.` : ""} You can book vehicle rentals directly to simplify your local transport!`;
    } else if (cleanQuery.includes("history") || cleanQuery.includes("built") || cleanQuery.includes("when")) {
      if (primarySite) {
        answerText = `**Historical RAG Insights for ${primarySite.name}**:\n\n${primarySite.history ? primarySite.history.substring(0, 320) + "..." : primarySite.description}\n\n*Location*: ${primarySite.location}${primarySite.isUnesco ? " • **UNESCO Recognized**" : ""}`;
      } else {
        answerText = `Ethiopia boasts over 3,000 years of recorded history, featuring ancient obelisks in Aksum, 12th-century rock-hewn churches in Lalibela, and 17th-century royal castles in Gondar.`;
      }
    } else if (cleanQuery.includes("how to get") || cleanQuery.includes("transport") || cleanQuery.includes("bus") || cleanQuery.includes("flight")) {
      answerText = `To visit **${primarySite?.name || "Ethiopia's heritage sites"}**, domestic flights via Ethiopian Airlines from Addis Ababa (Bole International) offer the fastest route. Luxury intercity buses (Selam Bus, Sky Bus) and private car rentals are also available for regional exploration.`;
    } else {
      // General synthesized answer
      if (primarySite) {
        answerText = `Here is what our TravelAssist AI system retrieved for **${primarySite.name}**:\n\n${primarySite.description || primarySite.history?.substring(0, 250)}\n\nLocated in **${primarySite.location}**, this destination offers deep historical significance. Scroll down to view nearby hotels and transport rentals for your trip.`;
      } else {
        answerText = `TravelAssist AI Assistant provides comprehensive insights into Ethiopian heritage sites, cultural events, and travel services. You can ask about history, recommended hotels, or local transport options!`;
      }
    }

    // 4. Formulate structured response payload
    const retrievedSources = [
      ...matchedHeritages.map((h) => ({
        id: h._id,
        name: h.name,
        type: "Heritage Site",
        location: h.location,
        isUnesco: h.isUnesco,
        image: h.image,
        link: `/explore/heritage/${h._id}`,
      })),
      ...matchedCultures.map((c) => ({
        id: c._id,
        name: c.name,
        type: "Cultural Event",
        location: c.location,
        isUnesco: c.isUnesco,
        image: c.image,
        link: `/explore/culture/${c._id}`,
      })),
    ];

    const suggestedPrompts = [
      `What are the best hotels near ${primarySite?.name || "Lalibela"}?`,
      `Tell me the history of ${primarySite?.name || "Gondar Castles"}`,
      `How do I arrange transportation to ${primarySite?.location?.split(",")[0] || "Aksum"}?`,
    ];

    return res.status(200).json({
      query,
      answer: answerText,
      retrievedSources,
      recommendedServices: {
        hotels: recommendedHotels,
        vehicles: recommendedVehicles,
      },
      suggestedPrompts,
      meta: {
        retrievedCount: retrievedSources.length,
        contextApplied: Boolean(contextSiteId),
        ragModelVersion: "v1.0-placeholder",
      },
    });
  } catch (error) {
    console.error("RAG Query Error:", error);
    return res.status(500).json({
      message: "An error occurred while processing the RAG AI query",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
