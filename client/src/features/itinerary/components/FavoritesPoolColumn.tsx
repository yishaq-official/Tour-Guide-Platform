import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { SortableItem } from "../../../components/SortableItem";
import { DroppableContainer } from "./DroppableContainer";

interface FavoritesPoolColumnProps {
  items: any[];
}

export function FavoritesPoolColumn({ items }: FavoritesPoolColumnProps) {
  return (
    <div className="lg:w-1/3 bg-gray-50 rounded-2xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Saved Favorites</h3>
      <p className="text-sm text-gray-500 mb-6">
        Drag these items into your itinerary days to plan your trip.
      </p>

      <SortableContext
        items={items?.map((i) => i.id) || []}
        strategy={verticalListSortingStrategy}
      >
        <DroppableContainer
          id="pool"
          className="space-y-4 min-h-[200px] p-2 -m-2 rounded-xl transition-colors"
        >
          {items?.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5 text-gray-400 shrink-0" />
              <img
                src={item.itemId.image}
                alt=""
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-green-600 uppercase">
                  {item.itemModel}
                </div>
                <h4 className="font-bold text-gray-900 truncate">{item.itemId.name}</h4>
              </div>
            </SortableItem>
          ))}
          {(!items || items.length === 0) && (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm">
              No favorites saved yet.
            </div>
          )}
        </DroppableContainer>
      </SortableContext>
    </div>
  );
}
