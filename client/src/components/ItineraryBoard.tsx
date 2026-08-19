import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, Trash2, MapPin, GripVertical } from 'lucide-react';
import { API_URL, apiFetch } from '../config';

interface ItineraryBoardProps {
  favorites: any[];
  initialItinerary: any[];
}

function DroppableContainer({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? 'bg-green-50 ring-2 ring-green-500' : ''}`}>
      {children}
    </div>
  );
}

export function ItineraryBoard({ favorites, initialItinerary }: ItineraryBoardProps) {
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize containers
    const newItems: Record<string, any[]> = { 'pool': favorites.map(f => ({ ...f, id: `fav-${f._id}`, isFavorite: true })) };
    
    // Determine max day
    let maxDay = 1;
    initialItinerary.forEach(item => {
      if (item.day > maxDay) maxDay = item.day;
    });
    
    for (let i = 1; i <= maxDay; i++) {
      newItems[`day-${i}`] = [];
    }
    
    initialItinerary.forEach(item => {
      const containerId = `day-${item.day}`;
      if (!newItems[containerId]) newItems[containerId] = [];
      newItems[containerId].push({ ...item, id: `itin-${item._id}` });
    });
    
    // Sort each day by order
    Object.keys(newItems).forEach(key => {
      if (key !== 'pool') {
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
    const dayNums = Object.keys(items).filter(k => k.startsWith('day-')).map(k => parseInt(k.replace('day-', '')));
    const nextDay = (dayNums.length > 0 ? Math.max(...dayNums) : 0) + 1;
    setItems(prev => ({ ...prev, [`day-${nextDay}`]: [] }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = Object.keys(items).find(key => items[key].some(item => item.id === active.id));
    const overId = over.id as string;
    
    // Find if over is a container or an item inside a container
    let overContainer = Object.keys(items).includes(overId) ? overId : Object.keys(items).find(key => items[key].some(item => item.id === overId));
    
    if (!activeContainer || !overContainer) return;

    let newItemsState = { ...items };

    if (activeContainer === overContainer) {
      // Reordering within the same container
      const activeIndex = items[activeContainer].findIndex(item => item.id === active.id);
      const overIndex = items[overContainer].findIndex(item => item.id === overId);
      
      if (activeIndex !== overIndex) {
        newItemsState[activeContainer] = arrayMove(items[activeContainer], activeIndex, overIndex);
      }
    } else {
      // Moving between containers
      const activeItem = items[activeContainer].find(item => item.id === active.id)!;
      
      // If dragging from pool, we clone it so it stays in pool, unless it's moving back to pool
      if (activeContainer === 'pool') {
        const newItem = { ...activeItem, id: `itin-new-${Date.now()}`, isFavorite: false };
        const overIndex = items[overContainer].findIndex(item => item.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : newItemsState[overContainer].length;
        
        newItemsState[overContainer] = [
          ...newItemsState[overContainer].slice(0, insertIndex),
          newItem,
          ...newItemsState[overContainer].slice(insertIndex)
        ];
      } else if (overContainer === 'pool') {
        // Remove from itinerary
        newItemsState[activeContainer] = newItemsState[activeContainer].filter(item => item.id !== active.id);
      } else {
        // Move from one day to another
        const overIndex = items[overContainer].findIndex(item => item.id === overId);
        const insertIndex = overIndex >= 0 ? overIndex : newItemsState[overContainer].length;
        
        newItemsState[activeContainer] = newItemsState[activeContainer].filter(item => item.id !== active.id);
        newItemsState[overContainer] = [
          ...newItemsState[overContainer].slice(0, insertIndex),
          activeItem,
          ...newItemsState[overContainer].slice(insertIndex)
        ];
      }
    }

    setItems(newItemsState);
    await syncToBackend(newItemsState);
  };
  
  const syncToBackend = async (currentItems: Record<string, any[]>) => {
    // Transform items back into itinerary format
    const payload: any[] = [];
    Object.keys(currentItems).forEach(key => {
      if (key !== 'pool') {
        const day = parseInt(key.replace('day-', ''));
        currentItems[key].forEach((item, index) => {
          payload.push({
            day,
            order: index,
            itemId: item.itemId._id || item.itemId, // Handle populated or raw ID
            itemModel: item.itemModel,
            notes: item.notes || ''
          });
        });
      }
    });

    try {
      await apiFetch(`${API_URL}/user/itinerary/sync`, {
        method: 'PUT',
        body: JSON.stringify({ itinerary: payload })
      });
    } catch (err) {
      console.error("Failed to sync itinerary", err);
    }
  };

  const removeItem = async (containerId: string, itemId: string) => {
    const newItems = { ...items };
    newItems[containerId] = newItems[containerId].filter(i => i.id !== itemId);
    setItems(newItems);
    await syncToBackend(newItems);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Favorites Pool */}
        <div className="lg:w-1/3 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Saved Favorites</h3>
          <p className="text-sm text-gray-500 mb-6">Drag these items into your itinerary days to plan your trip.</p>
          
          <SortableContext items={items['pool']?.map(i => i.id) || []} strategy={verticalListSortingStrategy}>
            <DroppableContainer id="pool" className="space-y-4 min-h-[200px] p-2 -m-2 rounded-xl transition-colors">
              {items['pool']?.map(item => (
                <SortableItem key={item.id} id={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-5 h-5 text-gray-400 shrink-0" />
                  <img src={item.itemId.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-green-600 uppercase">{item.itemModel}</div>
                    <h4 className="font-bold text-gray-900 truncate">{item.itemId.name}</h4>
                  </div>
                </SortableItem>
              ))}
              {(!items['pool'] || items['pool'].length === 0) && (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm">
                  No favorites saved yet.
                </div>
              )}
            </DroppableContainer>
          </SortableContext>
        </div>

        {/* Days Board */}
        <div className="lg:w-2/3 flex overflow-x-auto pb-4 gap-6 snap-x">
          {Object.keys(items).filter(k => k.startsWith('day-')).sort().map(dayKey => (
            <div key={dayKey} className="min-w-[320px] w-[320px] bg-gray-50 rounded-2xl p-6 border border-gray-200 snap-center flex flex-col max-h-[800px]">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                Day {dayKey.replace('day-', '')}
              </h3>
              
              <SortableContext items={items[dayKey].map(i => i.id)} strategy={verticalListSortingStrategy}>
                <DroppableContainer id={dayKey} className="flex-1 overflow-y-auto space-y-4 min-h-[150px] pb-4 p-2 -m-2 rounded-xl transition-colors">
                  {items[dayKey].map(item => (
                    <SortableItem key={item.id} id={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3 group relative">
                      <GripVertical className="w-5 h-5 text-gray-400 shrink-0 mt-2 cursor-grab active:cursor-grabbing" />
                      <div className="flex-1 min-w-0">
                        <img src={item.itemId.image} alt="" className="w-full h-24 rounded-lg object-cover mb-3" />
                        <div className="text-xs font-bold text-green-600 uppercase">{item.itemModel}</div>
                        <h4 className="font-bold text-gray-900 truncate">{item.itemId.name}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{item.itemId.location}</span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(dayKey, item.id)} className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </SortableItem>
                  ))}
                  {items[dayKey].length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm p-8">
                      Drop items here
                    </div>
                  )}
                </DroppableContainer>
              </SortableContext>
            </div>
          ))}
          
          {/* Add Day Button */}
          <button 
            onClick={addDay}
            className="min-w-[320px] w-[320px] bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer h-[150px] snap-center"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-bold">Add Another Day</span>
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
