import { Clock } from "lucide-react";

interface HotelPoliciesCardProps {
  policies?: {
    checkIn?: string;
    checkOut?: string;
    cancellation?: string;
  };
}

export function HotelPoliciesCard({ policies }: HotelPoliciesCardProps) {
  return (
    <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-green-600" /> Policies
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Check-in</h4>
          <p className="text-gray-900 font-medium">{policies?.checkIn || "2:00 PM"}</p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Check-out</h4>
          <p className="text-gray-900 font-medium">{policies?.checkOut || "11:00 AM"}</p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Cancellation</h4>
          <p className="text-gray-900 font-medium leading-relaxed">
            {policies?.cancellation || "Check specific room policy."}
          </p>
        </div>
      </div>
    </section>
  );
}
