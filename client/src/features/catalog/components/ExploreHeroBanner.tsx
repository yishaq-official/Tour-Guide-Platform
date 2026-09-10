import { Landmark, ScrollText, Users, Award } from "lucide-react";

interface ExploreHeroBannerProps {
  activeTab: "cultures" | "heritages";
  onTabChange: (tab: "cultures" | "heritages") => void;
}

export function ExploreHeroBanner({ activeTab, onTabChange }: ExploreHeroBannerProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 text-white relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 mb-4 shadow-xl">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
          Explore Ethiopia
        </h1>

        <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
          {activeTab === "cultures"
            ? "Discover the vibrant, living traditions, colorful ceremonies, and ancient festivals that define Ethiopian identity."
            : "Journey through 3,000 years of recorded history. From monolithic rock-hewn churches to majestic highlands."}
        </p>

        {/* Glassmorphic Navigation Tabs */}
        <div className="inline-flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 mb-10 shadow-2xl">
          <button
            onClick={() => onTabChange("cultures")}
            className={`px-6 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
              activeTab === "cultures"
                ? "bg-white text-green-800 shadow-lg scale-[1.02]"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Cultures & Festivals
          </button>
          <button
            onClick={() => onTabChange("heritages")}
            className={`px-6 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
              activeTab === "heritages"
                ? "bg-white text-green-800 shadow-lg scale-[1.02]"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Heritage Sites
          </button>
        </div>

        {/* Cultural Stats Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 mb-8">
          <div className="p-3 text-center">
            <Landmark className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">9</div>
            <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              UNESCO World Heritages
            </div>
          </div>

          <div className="p-3 text-center">
            <ScrollText className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">3,000+</div>
            <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              Years of History
            </div>
          </div>

          <div className="p-3 text-center">
            <Users className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">80+</div>
            <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              Living Traditions
            </div>
          </div>

          <div className="p-3 text-center">
            <Award className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">4</div>
            <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              Intangible Treasures
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
