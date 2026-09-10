import { api } from "../../../core/api/client";
import { ENDPOINTS } from "../../../core/api/endpoints";

export interface AIQueryRequest {
  query: string;
  contextSiteId?: string;
  contextType?: "heritage" | "culture";
}

export interface AIQueryResponse {
  query: string;
  answer: string;
  retrievedSources: Array<{
    id: string;
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

export const aiApi = {
  queryAssistant: (payload: AIQueryRequest) =>
    api.post<AIQueryResponse>(ENDPOINTS.AI_QUERY, payload),
};
