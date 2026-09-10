export interface BaseItem {
  _id: string;
  name: string;
  history: string;
  location: string;
  image: string;
  isUnesco: boolean;
}

export interface Heritage extends BaseItem {
  category: string;
  region: string;
  quickFacts?: Record<string, string>;
  touristHighlights?: TouristHighlight[];
  travelerExperience?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Culture extends BaseItem {
  category?: string;
  region?: string;
  quickFacts?: Record<string, string>;
  touristHighlights?: TouristHighlight[];
  travelerExperience?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TouristHighlight {
  title: string;
  description: string;
}
