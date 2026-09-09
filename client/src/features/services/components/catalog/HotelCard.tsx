import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import type { Hotel } from "../../types/service.types";

interface HotelCardProps {
  hotel: Hotel;
  index: number;
}

export function HotelCard({ hotel, index }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col"
    >
      <div className="relative h-56">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          {hotel.rating}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{hotel.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-green-600" />
          {hotel.location}
        </div>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">{hotel.description}</p>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">${hotel.pricePerNight}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <Link
            to={`/services/hotel/${hotel._id}`}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
