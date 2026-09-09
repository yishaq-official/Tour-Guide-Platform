import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Cog } from "lucide-react";
import type { Vehicle } from "../../types/service.types";

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
}

export function VehicleCard({ vehicle, index }: VehicleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col"
    >
      <div className="relative h-56 bg-gray-100 flex items-center justify-center p-4">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-contain mix-blend-multiply"
        />
        {vehicle.available && (
          <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Available
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          {vehicle.type}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">{vehicle.name}</h3>

        <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            {vehicle.seats} Seats
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Cog className="w-4 h-4 mr-2 text-gray-400" />
            {vehicle.transmission}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">${vehicle.pricePerDay}</span>
            <span className="text-gray-500 text-sm"> / day</span>
          </div>
          <Link
            to={`/services/vehicle/${vehicle._id}`}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
