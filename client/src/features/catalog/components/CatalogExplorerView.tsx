import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Search, RotateCcw, AlertCircle } from "lucide-react";
import { SkeletonGrid } from "../../../components/SkeletonCard";
import { useToast } from "../../../context/ToastContext";
import { catalogApi } from "../services/catalogApi";
import type { Heritage, Culture } from "../types/catalog.types";
import { ExploreHeroBanner } from "./ExploreHeroBanner";
import { ExploreFilterToolbar } from "./ExploreFilterToolbar";
import { CatalogCard } from "./CatalogCard";

const CATEGORY_CHIPS = [
  "All",
  "UNESCO Heritage",
  "Historical Castles",
  "Religious Festivals",
  "Natural Parks",
];

export function CatalogExplorerView() {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "heritages" ? "heritages" : "cultures";
  const search = searchParams.get("search") || "";
  const selectedRegion = searchParams.get("region") || "All";
  const unescoOnly = searchParams.get("unesco") === "true";
  const selectedCategory = searchParams.get("category") || "All";

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All" && value !== "false") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleTabChange = (tab: "cultures" | "heritages") => {
    updateParams({ tab, search: "", region: "All", unesco: "false", category: "All" });
  };

  const [heritages, setHeritages] = useState<Heritage[]>([]);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([catalogApi.getHeritages(), catalogApi.getCultures()])
      .then(([heritagesData, culturesData]) => {
        setHeritages(heritagesData);
        setCultures(culturesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data", err);
        setError("Failed to load explore data. Please check your connection and try again.");
        showToast("Failed to load explore catalog data", "error", "Network Error");
        setLoading(false);
      });
  }, [showToast]);

  const regions = ["All", ...Array.from(new Set(heritages.map((h) => h.region).filter(Boolean)))];

  const currentItems = activeTab === "heritages" ? heritages : cultures;

  const filteredItems = currentItems.filter((item: any) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      (item.history && item.history.toLowerCase().includes(search.toLowerCase()));

    const matchesRegion =
      activeTab === "heritages" ? selectedRegion === "All" || item.region === selectedRegion : true;

    const matchesUnesco = unescoOnly ? Boolean(item.isUnesco) : true;

    const itemCat = item.category ? item.category.toLowerCase() : "";
    const itemName = item.name.toLowerCase();

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : item.category === selectedCategory ||
          (selectedCategory === "UNESCO Heritage" && item.isUnesco) ||
          (selectedCategory === "Historical Castles" &&
            (itemName.includes("castle") ||
              itemName.includes("gondar") ||
              itemCat.includes("historical") ||
              itemCat.includes("castle"))) ||
          (selectedCategory === "Religious Festivals" &&
            (itemName.includes("timkat") ||
              itemName.includes("meskel") ||
              itemCat.includes("festival") ||
              itemCat.includes("religious"))) ||
          (selectedCategory === "Natural Parks" &&
            (itemCat.includes("nature") ||
              itemCat.includes("park") ||
              itemName.includes("park") ||
              itemName.includes("simien") ||
              itemName.includes("bale")));

    return matchesSearch && matchesRegion && matchesUnesco && matchesCategory;
  });

  const clearAllFilters = () => {
    updateParams({ search: "", region: "All", unesco: "false", category: "All" });
    showToast("Search & filters reset to default", "info", "Filters Cleared");
  };

  const isFilteringActive =
    search !== "" || selectedRegion !== "All" || unescoOnly || selectedCategory !== "All";

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-16">
      {/* Hero Banner & Cultural Stats */}
      <ExploreHeroBanner activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Toolbar */}
        <ExploreFilterToolbar
          activeTab={activeTab}
          search={search}
          onSearchChange={(q) => updateParams({ search: q })}
          selectedRegion={selectedRegion}
          onRegionChange={(r) => updateParams({ region: r })}
          regions={regions}
          unescoOnly={unescoOnly}
          onUnescoToggle={() => updateParams({ unesco: unescoOnly ? "false" : "true" })}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => updateParams({ category: cat })}
          categoryChips={CATEGORY_CHIPS}
          onReset={clearAllFilters}
          isFilteringActive={isFilteringActive}
        />

        {/* Content Area */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <CatalogCard key={item._id} item={item} activeTab={activeTab} index={index} />
              ))}
            </AnimatePresence>

            {error ? (
              <div className="col-span-full text-center py-16 bg-red-50/50 rounded-3xl border border-red-100 p-8">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Explore Data</h3>
                <p className="text-red-600 text-sm mb-6 max-w-md mx-auto">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Try Again
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-150 p-8 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results matching your query</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  {search
                    ? `We couldn't find any items matching "${search}".`
                    : "No heritage or cultural items match your selected filters."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-green-700/20"
                >
                  <RotateCcw className="w-4 h-4" /> Reset All Filters
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogExplorerView;
