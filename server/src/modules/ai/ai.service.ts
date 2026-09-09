import { heuristicRetriever } from "./retrieval/heuristicRetriever.js";

export interface RAGQueryPayload {
  query: string;
  contextSiteId?: string;
  contextType?: "heritage" | "culture";
}

export interface RAGResponse {
  query: string;
  answer: string;
  retrievedSources: Array<{
    id: any;
    name: string;
    type: string;
    location: string;
    isUnesco: boolean;
    image: string;
    link: string;
  }>;
  recommendedServices: {
    hotels: any[];
    vehicles: any[];
  };
  suggestedPrompts: string[];
  meta: {
    retrievedCount: number;
    contextApplied: boolean;
    ragModelVersion: string;
  };
}

export class AIService {
  async processQuery(payload: RAGQueryPayload): Promise<RAGResponse> {
    const { query, contextSiteId, contextType } = payload;
    const cleanQuery = query.trim().toLowerCase();

    // 1. Retrieval Phase
    const retrieval = await heuristicRetriever.retrieve(query, contextSiteId, contextType);
    const { matchedHeritages, matchedCultures, recommendedHotels, recommendedVehicles } = retrieval;

    const primarySite = matchedHeritages[0] || matchedCultures[0];

    // 2. Generation Phase
    let answerText = "";
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
      if (primarySite) {
        answerText = `Here is what our TravelAssist AI system retrieved for **${primarySite.name}**:\n\n${primarySite.description || primarySite.history?.substring(0, 250)}\n\nLocated in **${primarySite.location}**, this destination offers deep historical significance. Scroll down to view nearby hotels and transport rentals for your trip.`;
      } else {
        answerText = `TravelAssist AI Assistant provides comprehensive insights into Ethiopian heritage sites, cultural events, and travel services. You can ask about history, recommended hotels, or local transport options!`;
      }
    }

    // 3. Response Assembly
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

    return {
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
        ragModelVersion: "v1.0-modular",
      },
    };
  }
}

export const aiService = new AIService();
