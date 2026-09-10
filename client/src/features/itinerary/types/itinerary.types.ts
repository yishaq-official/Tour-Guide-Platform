export interface ItineraryItem {
  id: string;
  _id?: string;
  itemId: any;
  itemModel: string;
  day?: number;
  order?: number;
  notes?: string;
  isFavorite?: boolean;
}

export interface ItineraryBoardProps {
  favorites: any[];
  initialItinerary: any[];
}
