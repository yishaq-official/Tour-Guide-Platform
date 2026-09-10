import { useState, useEffect } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { API_URL, apiFetch } from "../../../config";
import { useToast } from "../../../context/ToastContext";

export function useItineraryDnD(favorites: any[], initialItinerary: any[]) {
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Initialize containers
    const newItems: Record<string, any[]> = {
      pool: favorites.map((f) => ({ ...f, id: `fav-${f._id}`, isFavorite: true })),
    };

    // Determine max day
    let maxDay = 1;
    initialItinerary.forEach((item) => {
      if (item.day > maxDay) maxDay = item.day;
    });

    for (let i = 1; i <= maxDay; i++) {
      newItems[`day-${i}`] = [];
    }

    initialItinerary.forEach((item) => {
      const containerId = `day-${item.day}`;
      if (!newItems[containerId]) newItems[containerId] = [];
      newItems[containerId].push({ ...item, id: `itin-${item._id}` });
    });

    // Sort each day by order
    Object.keys(newItems).forEach((key) => {
      if (key !== "pool") {
        newItems[key].sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    });

    setItems(newItems);
  }, [favorites, initialItinerary]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addDay = () => {
    const dayNums = Object.keys(items)
      .filter((k) => k.startsWith("day-"))
      .map((k) => parseInt(k.replace("day-", "")));
    const nextDay = (dayNums.length > 0 ? Math.max(...dayNums) : 0) + 1;
    setItems((prev) => ({ ...prev, [`day-${nextDay}`]: [] }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const syncToBackend = async (currentItems: Record<string, any[]>) => {
    const payload: any[] = [];
    Object.keys(currentItems).forEach((key) => {
      if (key !== "pool") {
        const day = parseInt(key.replace("day-", ""));
        currentItems[key].forEach((item, index) => {
          payload.push({
            day,
            order: index,
            itemId: item.itemId._id || item.itemId,
            itemModel: item.itemModel,
            notes: item.notes || "",
          });
        });
      }
    });

    try {
      await apiFetch(`${API_URL}/user/itinerary/sync`, {
        method: "PUT",
        body: JSON.stringify({ itinerary: payload }),
      });
    } catch (err) {
      console.error("Failed to sync itinerary", err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = Object.keys(items).find((key) =>
      items[key].some((item) => item.id === active.id)
    );
    const overId = over.id as string;

    const overContainer = Object.keys(items).includes(overId)
      ? overId
      : Object.keys(items).find((key) => items[key].some((item) => item.id === overId));

    if (!activeContainer || !overContainer) return;

    const newItemsState = { ...items };

    if (activeContainer === overContainer) {
      const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
      const overIndex = items[overContainer].findIndex((item) => item.id === overId);

      if (activeIndex !== overIndex) {
        newItemsState[activeContainer] = arrayMove(items[activeContainer], activeIndex, overIndex);
      }
    } else {
      const activeItem = items[activeContainer].find((item) => item.id === active.id)!;

      if (activeContainer === "pool") {
        const newItem = { ...activeItem, id: `itin-new-${Date.now()}`, isFavorite: false };
        const overIndex = items[overContainer].findIndex((item) => item.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : newItemsState[overContainer].length;

        newItemsState[overContainer] = [
          ...newItemsState[overContainer].slice(0, insertIndex),
          newItem,
          ...newItemsState[overContainer].slice(insertIndex),
        ];
      } else if (overContainer === "pool") {
        newItemsState[activeContainer] = newItemsState[activeContainer].filter(
          (item) => item.id !== active.id
        );
      } else {
        const overIndex = items[overContainer].findIndex((item) => item.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : newItemsState[overContainer].length;

        newItemsState[activeContainer] = newItemsState[activeContainer].filter(
          (item) => item.id !== active.id
        );
        newItemsState[overContainer] = [
          ...newItemsState[overContainer].slice(0, insertIndex),
          activeItem,
          ...newItemsState[overContainer].slice(insertIndex),
        ];
      }
    }

    setItems(newItemsState);
    await syncToBackend(newItemsState);
  };

  const removeItem = async (containerId: string, itemId: string) => {
    const newItems = { ...items };
    newItems[containerId] = newItems[containerId].filter((i) => i.id !== itemId);
    setItems(newItems);
    await syncToBackend(newItems);
  };

  const exportItinerary = () => {
    const dayKeys = Object.keys(items)
      .filter((k) => k.startsWith("day-"))
      .sort((a, b) => parseInt(a.replace("day-", "")) - parseInt(b.replace("day-", "")));
    let exportText = `📍 My Ethiopia Travel Itinerary\n=================================\n\n`;
    let totalItemsCount = 0;

    dayKeys.forEach((dayKey) => {
      const dayNum = dayKey.replace("day-", "");
      const dayItems = items[dayKey] || [];
      exportText += `📅 Day ${dayNum}:\n`;
      if (dayItems.length === 0) {
        exportText += `   (Free / Unscheduled Day)\n\n`;
      } else {
        dayItems.forEach((item, idx) => {
          totalItemsCount++;
          const name = item.itemId?.name || "Destination";
          const model = item.itemModel || "Place";
          const loc = item.itemId?.location ? ` (${item.itemId.location})` : "";
          exportText += `   ${idx + 1}. ${name} - ${model}${loc}\n`;
        });
        exportText += `\n`;
      }
    });

    exportText += `Generated via TravelAssist Platform\n`;

    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    showToast(
      `Copied ${totalItemsCount} scheduled itinerary items to clipboard!`,
      "success",
      "Itinerary Exported"
    );
  };

  return {
    items,
    activeId,
    sensors,
    addDay,
    handleDragStart,
    handleDragEnd,
    removeItem,
    exportItinerary,
    copied,
  };
}
