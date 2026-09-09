export interface RetrievedSource {
  id: string;
  name: string;
  type: string;
  location: string;
  isUnesco: boolean;
  image: string;
  link: string;
}

export interface RecommendedService {
  _id: string;
  name: string;
  location?: string;
  pricePerNight?: number;
  pricePerDay?: number;
  image?: string;
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  retrievedSources?: RetrievedSource[];
  recommendedServices?: {
    hotels?: RecommendedService[];
    vehicles?: RecommendedService[];
  };
  suggestedPrompts?: string[];
  timestamp: string;
}
