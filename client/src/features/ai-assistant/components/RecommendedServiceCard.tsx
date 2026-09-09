import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import type { RecommendedService } from "../types/ai.types";

interface RecommendedServiceCardProps {
  hotels?: RecommendedService[];
  onSelect: () => void;
}

export function RecommendedServiceCard({ hotels, onSelect }: RecommendedServiceCardProps) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-2">
        🏨 Nearby Recommended Hotels
      </span>
      <div className="grid grid-cols-1 gap-2">
        {hotels.map((hotel) => (
          <Link
            key={hotel._id}
            to={`/services/hotel/${hotel._id}`}
            onClick={onSelect}
            className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-medium text-gray-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-green-600" />
              <span>{hotel.name}</span>
            </div>
            {hotel.pricePerNight && (
              <span className="font-bold text-green-700">${hotel.pricePerNight}/night</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
