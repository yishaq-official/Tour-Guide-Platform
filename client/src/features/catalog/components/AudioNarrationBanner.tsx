import { Volume2, VolumeX } from "lucide-react";

interface AudioNarrationBannerProps {
  name: string;
  isPlayingAudio: boolean;
  onToggleAudioGuide: () => void;
}

export function AudioNarrationBanner({
  name,
  isPlayingAudio,
  onToggleAudioGuide,
}: AudioNarrationBannerProps) {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-800 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            isPlayingAudio ? "bg-green-500 text-white animate-bounce" : "bg-white/10 text-green-400"
          }`}
        >
          <Volume2 className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-green-400">
            Interactive Audio Experience
          </span>
          <h3 className="text-xl font-bold text-white">Audio Guide Narration</h3>
          <p className="text-xs sm:text-sm text-gray-300">
            Listen to an AI-narrated historical overview of {name}
          </p>
        </div>
      </div>

      <button
        onClick={onToggleAudioGuide}
        className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shrink-0 flex items-center justify-center gap-2 ${
          isPlayingAudio
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        <span>{isPlayingAudio ? "Stop Narration" : "Play Audio Guide"}</span>
      </button>
    </div>
  );
}
