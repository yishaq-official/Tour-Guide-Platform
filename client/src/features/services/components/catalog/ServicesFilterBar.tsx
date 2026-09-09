import { Building2, CarFront, Search, X, ArrowUpDown, Star, RotateCcw } from "lucide-react";

export type SortOption = "featured" | "price_low" | "price_high" | "rating";

interface ServicesFilterBarProps {
  activeTab: "hotels" | "vehicles";
  onTabChange: (tab: "hotels" | "vehicles") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  onReset: () => void;
  isFilteringActive: boolean;
}

export function ServicesFilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  minRating,
  onMinRatingChange,
  onReset,
  isFilteringActive,
}: ServicesFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
      {/* Tab Buttons */}
      <div className="flex gap-3 shrink-0">
        <button
          onClick={() => onTabChange("hotels")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all duration-300 ${
            activeTab === "hotels"
              ? "bg-green-700 text-white shadow-lg shadow-green-700/20 scale-[1.02]"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Building2 className="w-5 h-5" /> Stays & Hotels
        </button>
        <button
          onClick={() => onTabChange("vehicles")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all duration-300 ${
            activeTab === "vehicles"
              ? "bg-green-700 text-white shadow-lg shadow-green-700/20 scale-[1.02]"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <CarFront className="w-5 h-5" /> Vehicle Rentals
        </button>
      </div>

      {/* Search & Sort Options */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64 min-w-[200px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === "hotels" ? "Search stays, cities..." : "Search vehicles, types..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-600 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="pl-9 pr-8 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-600 outline-none cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            {activeTab === "hotels" && <option value="rating">Highest Rated</option>}
          </select>
        </div>

        {/* Rating Filter (Hotels only) */}
        {activeTab === "hotels" && (
          <div className="relative flex items-center">
            <Star className="absolute left-3 w-4 h-4 text-amber-500 fill-current pointer-events-none" />
            <select
              value={minRating}
              onChange={(e) => onMinRatingChange(Number(e.target.value))}
              className="pl-9 pr-8 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-600 outline-none cursor-pointer"
            >
              <option value={0}>All Ratings</option>
              <option value={4}>4.0★ & Above</option>
              <option value={4.5}>4.5★ & Above</option>
            </select>
          </div>
        )}

        {/* Reset Filters */}
        {isFilteringActive && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
