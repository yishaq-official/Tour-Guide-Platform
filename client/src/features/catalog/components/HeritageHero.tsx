import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, VolumeX, Heart, Star, MapPin } from "lucide-react";
import type { Heritage } from "../types/catalog.types";

interface HeritageHeroProps {
  heritage: Heritage;
  session: any;
  isFavorite: boolean;
  isTogglingFavorite: boolean;
  onToggleFavorite: () => void;
  isPlayingAudio: boolean;
  onToggleAudioGuide: () => void;
}

export function HeritageHero({
  heritage,
  session,
  isFavorite,
  isTogglingFavorite,
  onToggleFavorite,
  isPlayingAudio,
  onToggleAudioGuide,
}: HeritageHeroProps) {
  return (
    <div className="relative h-[65vh] md:h-[80vh] w-full bg-gray-900">
      <img
        src={heritage.image}
        alt={heritage.name}
        className="w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/30" />

      {/* Top Navigation Bar */}
      <div className="absolute top-6 left-6 right-6 md:top-10 md:left-10 md:right-10 z-20 flex justify-between items-center">
        <Link
          to="/explore?tab=heritages"
          className="inline-flex items-center text-white/90 hover:text-white transition-all text-xs font-black uppercase tracking-wider bg-black/40 hover:bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAudioGuide}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all shadow-lg border ${
              isPlayingAudio
                ? "bg-green-600 text-white border-green-400 animate-pulse"
                : "bg-black/40 hover:bg-green-700/80 text-white border-white/20"
            }`}
            title="Listen to Heritage Guide"
          >
            {isPlayingAudio ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-green-400" />
            )}
            <span>{isPlayingAudio ? "Pause Audio" : "Audio Guide"}</span>
          </button>

          {session && (
            <button
              onClick={onToggleFavorite}
              disabled={isTogglingFavorite}
              className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg ${
                isFavorite
                  ? "bg-red-500/90 text-white"
                  : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Hero Title & Badges */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {heritage.isUnesco && (
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide flex items-center gap-1.5 border border-amber-300">
                <Star className="w-3.5 h-3.5 fill-current" />
                UNESCO World Heritage
              </span>
            )}
            <span className="bg-emerald-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide border border-emerald-500">
              {heritage.region || heritage.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
            {heritage.name}
          </h1>

          <div className="flex items-center text-white/90 max-w-3xl mb-6">
            <MapPin className="w-5 h-5 mr-2 text-green-400 shrink-0" />
            <span className="text-base md:text-lg font-medium drop-shadow-md">
              {heritage.location}
            </span>
          </div>

          <button
            onClick={onToggleAudioGuide}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-2xl border ${
              isPlayingAudio
                ? "bg-green-500 text-white border-green-300 animate-pulse scale-[1.02]"
                : "bg-white text-gray-900 hover:bg-green-600 hover:text-white border-white/40"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-5 h-5 text-white" />
                <span>Pause Audio Narration</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-green-600" />
                <span>Listen to Audio Guide</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
