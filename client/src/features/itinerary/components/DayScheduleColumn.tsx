import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical, MapPin, Trash2 } from "lucide-react";
import { SortableItem } from "../../../components/SortableItem";
import { DroppableContainer } from "./DroppableContainer";

interface DayScheduleColumnProps {
  dayKey: string;
  items: any[];
  onRemoveItem: (containerId: string, itemId: string) => void;
}

export function DayScheduleColumn({
  dayKey,
  items,
  onRemoveItem,
}: DayScheduleColumnProps) {
  const dayNumber = dayKey.replace("day-", "");

  return (
    <div className="min-w-[320px] w-[320px] bg-gray-50 rounded-2xl p-6 border border-gray-200 snap-center flex flex-col max-h-[800px]">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
        Day {dayNumber}
      </h3>

      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <DroppableContainer
          id={dayKey}
          className="flex-1 overflow-y-auto space-y-4 min-h-[150px] pb-4 p-2 -m-2 rounded-xl transition-colors"
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3 group relative"
            >
              <GripVertical className="w-5 h-5 text-gray-400 shrink-0 mt-2 cursor-grab active:cursor-grabbing" />
              <div className="flex-1 min-w-0">
                <img
                  src={item.itemId.image}
                  alt=""
                  className="w-full h-24 rounded-lg object-cover mb-3"
                />
                <div className="text-xs font-bold text-green-600 uppercase">
                  {item.itemModel}
                </div>
                <h4 className="font-bold text-gray-900 truncate">{item.itemId.name}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{item.itemId.location}</span>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(dayKey, item.id)}
                className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </SortableItem>
          ))}
          {items.length === 0 && (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm p-8">
              Drop items here
            </div>
          )}
        </DroppableContainer>
      </SortableContext>
    </div>
  );
}
