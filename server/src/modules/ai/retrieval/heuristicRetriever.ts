import { Heritage } from "../../../models/Heritage.js";
import { Culture } from "../../../models/Culture.js";
import { Hotel } from "../../../models/Hotel.js";
import { Vehicle } from "../../../models/Vehicle.js";

export interface RetrievalResult {
  matchedHeritages: any[];
  matchedCultures: any[];
  recommendedHotels: any[];
  recommendedVehicles: any[];
}

export class HeuristicRetriever {
  async retrieve(query: string, contextSiteId?: string, contextType?: string): Promise<RetrievalResult> {
    const cleanQuery = query.trim().toLowerCase();

    let matchedHeritages: any[] = [];
    let matchedCultures: any[] = [];

    // Context-specific lookup
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

    // Fallback if no matches
    if (matchedHeritages.length === 0 && matchedCultures.length === 0) {
      matchedHeritages = await Heritage.find({ isUnesco: true }).limit(2);
    }

    // Nearby services matching
    const primaryLocation =
      matchedHeritages[0]?.location ||
      matchedHeritages[0]?.region ||
      matchedCultures[0]?.location ||
      "Gondar";

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

    const recommendedVehicles = await Vehicle.find({ available: true }).limit(2);

    return {
      matchedHeritages,
      matchedCultures,
      recommendedHotels,
      recommendedVehicles,
    };
  }
}

export const heuristicRetriever = new HeuristicRetriever();
