import { Building, Car, ClipboardList, Plus } from "lucide-react";
import type { TabType } from "../types/partner.types";

interface PartnerTabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isHotelView: boolean;
  primaryTabLabel: string;
  primaryTabCount: number;
  reservationsCount: number;
  primaryCtaLabel: string;
  onAddClick: () => void;
  accentButton: string;
}

export function PartnerTabSelector({
  activeTab,
  onTabChange,
  isHotelView,
  primaryTabLabel,
  primaryTabCount,
  reservationsCount,
  primaryCtaLabel,
  onAddClick,
  accentButton,
}: PartnerTabSelectorProps) {
  const PrimaryIcon = isHotelView ? Building : Car;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 self-start">
        <button
          onClick={() => onTabChange(isHotelView ? "hotels" : "vehicles")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === (isHotelView ? "hotels" : "vehicles")
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PrimaryIcon className="w-4 h-4" />
          <span>{primaryTabLabel}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold">
            {primaryTabCount}
          </span>
        </button>

        <button
          onClick={() => onTabChange("reservations")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "reservations"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Reservations</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold">
            {reservationsCount}
          </span>
        </button>
      </div>

      <button
        onClick={onAddClick}
        className={`flex items-center justify-center gap-2 px-6 py-3 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all ${accentButton}`}
      >
        <Plus className="w-4 h-4" />
        <span>{primaryCtaLabel}</span>
      </button>
    </div>
  );
}
