import { Wifi, Coffee, Utensils, Car, CheckCircle2, Info } from "lucide-react";

interface HotelAmenitiesProps {
  amenities: string[];
}

export function HotelAmenities({ amenities }: HotelAmenitiesProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {amenities.map((amenity, idx) => {
          let Icon = Info;
          const lower = amenity.toLowerCase();
          if (lower.includes("wifi")) Icon = Wifi;
          if (lower.includes("pool")) Icon = Coffee;
          if (lower.includes("restaurant")) Icon = Utensils;
          if (lower.includes("parking")) Icon = Car;
          if (lower.includes("spa")) Icon = CheckCircle2;

          return (
            <div
              key={idx}
              className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100"
            >
              <Icon className="w-5 h-5 mr-3 text-green-600" />
              <span className="font-medium">{amenity}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
