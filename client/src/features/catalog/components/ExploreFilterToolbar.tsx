import { Search, X, Filter, Star, RotateCcw } from "lucide-react";

interface ExploreFilterToolbarProps {
  activeTab: "cultures" | "heritages";
  search: string;
  onSearchChange: (q: string) => void;
  selectedRegion: string;
  onRegionChange: (r: string) => void;
  regions: string[];
  unescoOnly: boolean;
  onUnescoToggle: () => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categoryChips: string[];
  onReset: () => void;
  isFilteringActive: boolean;
}

export function ExploreFilterToolbar({
  activeTab,
  search,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  regions,
  unescoOnly,
  onUnescoToggle,
  selectedCategory,
  onCategoryChange,
  categoryChips,
  onReset,
  isFilteringActive,
}: ExploreFilterToolbarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-150 -mt-12 relative z-20 mb-12">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${
              activeTab === "heritages"
                ? "heritage sites, monuments, cities"
                : "cultural festivals, traditions"
            }...`}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Dropdown (For Heritages) */}
        {activeTab === "heritages" && (
          <div className="relative w-full lg:w-56">
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm appearance-none cursor-pointer shadow-sm font-medium text-gray-700"
            >
              <option value="All">All Regions</option>
              {regions
                .filter((r) => r !== "All")
                .map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </select>
            <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          </div>
        )}

        {/* UNESCO Only Toggle */}
        <button
          onClick={onUnescoToggle}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all duration-200 ${
            unescoOnly
              ? "bg-amber-400 text-amber-950 border-amber-400 shadow-md shadow-amber-400/20 scale-[1.02]"
              : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          <Star
            className={`w-4 h-4 ${unescoOnly ? "fill-current text-amber-950" : "text-amber-500"}`}
          />
          UNESCO Sites Only
        </button>
      </div>

      {/* Category Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-gray-100 scrollbar-none">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">
          Filter By:
        </span>
        {categoryChips.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-green-700 text-white shadow-md shadow-green-700/20"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}

        {isFilteringActive && (
          <button
            onClick={onReset}
            className="ml-auto text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 shrink-0 px-2 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
