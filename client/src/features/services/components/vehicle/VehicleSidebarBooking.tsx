import { CheckCircle2 } from "lucide-react";

interface VehicleSidebarBookingProps {
  pricePerDay: number;
  available: boolean;
  onBookClick: () => void;
}

export function VehicleSidebarBooking({
  pricePerDay,
  available,
  onBookClick,
}: VehicleSidebarBookingProps) {
  return (
    <div className="lg:w-1/3">
      <div className="sticky top-24 bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-6">
          <div>
            <span className="text-gray-500 text-sm font-medium uppercase tracking-wider block mb-1">
              Daily Rate
            </span>
            <div className="text-4xl font-extrabold text-gray-900">${pricePerDay}</div>
          </div>
        </div>

        <ul className="space-y-4 mb-8 text-sm text-gray-600 font-medium">
          <li className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" /> Instant Confirmation
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" /> Secure Payment at Pick-up
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" /> 24/7 Roadside Assistance
          </li>
        </ul>

        <button
          onClick={onBookClick}
          disabled={!available}
          className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white font-bold rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
        >
          {available ? "Proceed to Booking" : "Not Available"}
        </button>
      </div>
    </div>
  );
}
