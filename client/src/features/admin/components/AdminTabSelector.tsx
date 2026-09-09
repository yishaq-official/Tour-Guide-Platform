import { Landmark, Compass, Hotel, Car, Plus } from "lucide-react";
import type { TabType } from "../types/admin.types";

interface AdminTabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAddClick: () => void;
}

export function AdminTabSelector({
  activeTab,
  onTabChange,
  onAddClick,
}: AdminTabSelectorProps) {
  const tabs = [
    { id: "heritages" as TabType, label: "UNESCO Heritages", icon: Landmark },
    { id: "cultures" as TabType, label: "Cultural Traditions", icon: Compass },
    { id: "hotels" as TabType, label: "Hotels & Stays", icon: Hotel },
    { id: "vehicles" as TabType, label: "Rental Vehicles", icon: Car },
  ];

  return (
    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex bg-gray-150/60 p-1.5 rounded-2xl gap-1.5 self-start">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-white text-gray-950 shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-green-600/10 text-sm"
      >
        <Plus className="w-4 h-4" /> Add New {activeTab.slice(0, -1)}
      </button>
    </div>
  );
}
