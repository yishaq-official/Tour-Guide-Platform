import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { Plus, GripVertical, Copy, Check } from "lucide-react";
import type { ItineraryBoardProps } from "../features/itinerary/types/itinerary.types";
import { useItineraryDnD } from "../features/itinerary/hooks/useItineraryDnD";
import { FavoritesPoolColumn } from "../features/itinerary/components/FavoritesPoolColumn";
import { DayScheduleColumn } from "../features/itinerary/components/DayScheduleColumn";

export function ItineraryBoard({ favorites, initialItinerary }: ItineraryBoardProps) {
  const {
    items,
    activeId,
    sensors,
    addDay,
    handleDragStart,
    handleDragEnd,
    removeItem,
    exportItinerary,
    copied,
  } = useItineraryDnD(favorites, initialItinerary);

  const dayKeys = Object.keys(items)
    .filter((k) => k.startsWith("day-"))
    .sort();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Top Action Header Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Interactive Trip Builder</h3>
          <p className="text-xs text-gray-500">
            Organize your saved favorites into daily schedules.
          </p>
        </div>
        <button
          onClick={exportItinerary}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-green-700/20 shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied to Clipboard!" : "Export / Copy Itinerary"}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Favorites Pool */}
        <FavoritesPoolColumn items={items["pool"]} />

        {/* Days Board */}
        <div className="lg:w-2/3 flex overflow-x-auto pb-4 gap-6 snap-x">
          {dayKeys.map((dayKey) => (
            <DayScheduleColumn
              key={dayKey}
              dayKey={dayKey}
              items={items[dayKey] || []}
              onRemoveItem={removeItem}
            />
          ))}

          {/* Add Day Button */}
          <button
            onClick={addDay}
            className="min-w-[320px] w-[320px] bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer h-[150px] snap-center"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-bold">Add another Day</span>
          </button>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200 flex items-center gap-4 opacity-90 scale-105">
            <GripVertical className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 truncate">Moving Item...</h4>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
