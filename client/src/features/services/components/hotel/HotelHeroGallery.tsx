import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Star, MapPin } from "lucide-react";
import type { Hotel } from "../../types/service.types";

interface HotelHeroGalleryProps {
  hotel: Hotel;
  session: any;
  isFavorite: boolean;
  isTogglingFavorite: boolean;
  onToggleFavorite: () => void;
  onBookClick: () => void;
}

export function HotelHeroGallery({
  hotel,
  session,
  isFavorite,
  isTogglingFavorite,
  onToggleFavorite,
  onBookClick,
}: HotelHeroGalleryProps) {
  return (
    <div className="relative h-[60vh] md:h-[70vh] bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 flex">
        {hotel.gallery && hotel.gallery.length > 0 ? (
          <>
            <div className="w-full md:w-2/3 h-full relative border-r border-white/10">
              <img
                src={hotel.gallery[0] || hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:flex flex-col w-1/3 h-full">
              <div className="h-1/2 relative border-b border-white/10">
                <img
                  src={hotel.gallery[1] || hotel.image}
                  alt="Interior 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/2 relative">
                <img
                  src={hotel.gallery[2] || hotel.image}
                  alt="Interior 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </>
        ) : (
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover opacity-80" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 flex justify-between right-8 md:right-12">
        <Link
          to="/services"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>

        {session && (
          <button
            onClick={onToggleFavorite}
            disabled={isTogglingFavorite}
            className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all ${
              isFavorite
                ? "bg-red-500/80 text-white"
                : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                <Star className="w-3.5 h-3.5 mr-1 fill-current" /> {hotel.rating}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                <MapPin className="w-3 h-3 inline mr-1" /> {hotel.location}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {hotel.name}
            </h1>
          </div>
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center">
            <span className="text-white/80 text-sm font-medium mb-1">Starting from</span>
            <div className="text-white font-bold text-4xl mb-4">
              ${hotel.pricePerNight}
              <span className="text-lg text-white/60 font-normal">/night</span>
            </div>
            <button
              onClick={onBookClick}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
            >
              Reserve a Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
