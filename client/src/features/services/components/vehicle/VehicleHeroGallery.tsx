import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, X, Users, Cog, Heart } from "lucide-react";
import type { Vehicle } from "../../types/service.types";

interface VehicleHeroGalleryProps {
  vehicle: Vehicle;
  session: any;
  isFavorite: boolean;
  isTogglingFavorite: boolean;
  onToggleFavorite: () => void;
}

export function VehicleHeroGallery({
  vehicle,
  session,
  isFavorite,
  isTogglingFavorite,
  onToggleFavorite,
}: VehicleHeroGalleryProps) {
  return (
    <div className="relative h-[50vh] md:h-[60vh] bg-gray-100 overflow-hidden pt-20">
      <div className="absolute top-24 left-8 md:top-28 md:left-12 z-20 flex justify-between right-8 md:right-12">
        <Link
          to="/services"
          className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm font-semibold uppercase tracking-wider bg-white/80 px-4 py-2 rounded-full backdrop-blur-md border border-gray-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>

        {session && (
          <button
            onClick={onToggleFavorite}
            disabled={isTogglingFavorite}
            className={`p-3 rounded-full backdrop-blur-md border transition-all ${
              isFavorite
                ? "bg-red-50 text-red-500 border-red-100"
                : "bg-white/80 text-gray-400 border-gray-200 hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="text-[20vw] font-black uppercase text-gray-900 leading-none tracking-tighter mix-blend-overlay">
          {vehicle.type}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full pb-8">
          <div className="w-full md:w-1/2 flex flex-col justify-center mt-16 md:mt-0">
            <div className="inline-flex items-center bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit uppercase tracking-wide shadow-sm">
              {vehicle.available ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Available for Rent
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5 mr-1 text-red-600" />
                  <span className="text-red-700">Currently Rented</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
              {vehicle.name}
            </h1>
            <div className="text-xl text-gray-500 font-medium mb-6 uppercase tracking-widest">
              {vehicle.type}
            </div>

            <div className="flex gap-4">
              <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold">Capacity</div>
                  <div className="font-bold text-gray-900">{vehicle.seats} Seats</div>
                </div>
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                  <Cog className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold">Gearbox</div>
                  <div className="font-bold text-gray-900">{vehicle.transmission}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-full flex items-center justify-center relative mt-8 md:mt-0">
            <motion.img
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full max-w-lg object-contain drop-shadow-2xl z-20 mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
