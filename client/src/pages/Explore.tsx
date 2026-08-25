import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Search, Filter, Landmark, Sparkles, ScrollText, Users, Award, 
  Star, X, RotateCcw
} from 'lucide-react';
import { API_URL } from '../config';

interface BaseItem {
  _id: string;
  name: string;
  history: string;
  location: string;
  image: string;
  isUnesco: boolean;
}

interface Heritage extends BaseItem {
  category: string;
  region: string;
}

interface Culture extends BaseItem {
  category?: string;
  region?: string;
}

const CATEGORY_CHIPS = [
  'All',
  'UNESCO Heritage',
  'Historical Castles',
  'Religious Festivals',
  'Natural Parks'
];

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'heritages' ? 'heritages' : 'cultures';
  const search = searchParams.get('search') || '';
  const selectedRegion = searchParams.get('region') || 'All';
  const unescoOnly = searchParams.get('unesco') === 'true';
  const selectedCategory = searchParams.get('category') || 'All';
  
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== 'false') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };
  
  const handleTabChange = (tab: 'cultures' | 'heritages') => {
    updateParams({ tab, search: '', region: 'All', unesco: 'false', category: 'All' });
  };
  
  const [heritages, setHeritages] = useState<Heritage[]>([]);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      fetch(`${API_URL}/heritages`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch heritages');
        return res.json();
      }),
      fetch(`${API_URL}/cultures`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch cultures');
        return res.json();
      })
    ])
    .then(([heritagesData, culturesData]) => {
      setHeritages(heritagesData);
      setCultures(culturesData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch data", err);
      setError('Failed to load explore data. Please check your connection and try again.');
      setLoading(false);
    });
  }, []);

  const regions = ['All', ...Array.from(new Set(heritages.map(h => h.region).filter(Boolean)))];

  const currentItems = activeTab === 'heritages' ? heritages : cultures;

  const filteredItems = currentItems.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.location.toLowerCase().includes(search.toLowerCase()) ||
                          (item.history && item.history.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRegion = activeTab === 'heritages' ? (selectedRegion === 'All' || item.region === selectedRegion) : true;
    
    const matchesUnesco = unescoOnly ? Boolean(item.isUnesco) : true;
    
    const itemCat = item.category ? item.category.toLowerCase() : '';
    const itemName = item.name.toLowerCase();

    const matchesCategory = selectedCategory === 'All' ? true : (
      item.category === selectedCategory || 
      (selectedCategory === 'UNESCO Heritage' && item.isUnesco) ||
      (selectedCategory === 'Historical Castles' && (itemName.includes('castle') || itemName.includes('gondar') || itemCat.includes('historical') || itemCat.includes('castle'))) ||
      (selectedCategory === 'Religious Festivals' && (itemName.includes('timkat') || itemName.includes('meskel') || itemCat.includes('festival') || itemCat.includes('religious'))) ||
      (selectedCategory === 'Natural Parks' && (itemCat.includes('nature') || itemCat.includes('park') || itemName.includes('park') || itemName.includes('simien') || itemName.includes('bale')))
    );

    return matchesSearch && matchesRegion && matchesUnesco && matchesCategory;
  });

  const clearAllFilters = () => {
    updateParams({ search: '', region: 'All', unesco: 'false', category: 'All' });
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-16">
      {/* Immersive Hero Banner & Stats Bar */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 text-white relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 mb-4 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider mb-4 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            Uncover Timeless Wonders
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4">
            Explore Ethiopia
          </h1>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            {activeTab === 'cultures' 
              ? "Discover the vibrant, living traditions, colorful ceremonies, and ancient festivals that define Ethiopian identity."
              : "Journey through 3,000 years of recorded history. From monolithic rock-hewn churches to majestic highlands."
            }
          </p>

          {/* Glassmorphic Navigation Tabs */}
          <div className="inline-flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 mb-10 shadow-2xl">
            <button
              onClick={() => handleTabChange('cultures')}
              className={`px-6 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                activeTab === 'cultures' 
                  ? 'bg-white text-green-800 shadow-lg scale-[1.02]' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Cultures & Festivals
            </button>
            <button
              onClick={() => handleTabChange('heritages')}
              className={`px-6 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                activeTab === 'heritages' 
                  ? 'bg-white text-green-800 shadow-lg scale-[1.02]' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
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
              <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">UNESCO World Heritages</div>
            </div>

            <div className="p-3 text-center">
              <ScrollText className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-white">3,000+</div>
              <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Years of History</div>
            </div>

            <div className="p-3 text-center">
              <Users className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-white">80+</div>
              <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Living Traditions</div>
            </div>

            <div className="p-3 text-center">
              <Award className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-white">4</div>
              <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Intangible Treasures</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* FLOATING FROSTED-GLASS CONTROL TOOLBAR */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-150 -mt-12 relative z-20 mb-12">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-5">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab === 'heritages' ? 'heritage sites, monuments, cities' : 'cultural festivals, traditions'}...`} 
                value={search}
                onChange={(e) => updateParams({ search: e.target.value })}
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition-all shadow-sm"
              />
              {search && (
                <button 
                  onClick={() => updateParams({ search: '' })}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Region Dropdown (For Heritages) */}
            {activeTab === 'heritages' && (
              <div className="relative w-full lg:w-56">
                <select
                  value={selectedRegion}
                  onChange={(e) => updateParams({ region: e.target.value })}
                  className="w-full pl-10 pr-8 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm appearance-none cursor-pointer shadow-sm font-medium text-gray-700"
                >
                  <option value="All">All Regions</option>
                  {regions.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            )}

            {/* UNESCO Only Toggle */}
            <button
              onClick={() => updateParams({ unesco: unescoOnly ? 'false' : 'true' })}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all duration-200 ${
                unescoOnly 
                  ? 'bg-amber-400 text-amber-950 border-amber-400 shadow-md shadow-amber-400/20 scale-[1.02]' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <Star className={`w-4 h-4 ${unescoOnly ? 'fill-current text-amber-950' : 'text-amber-500'}`} />
              UNESCO Sites Only
            </button>
          </div>

          {/* Category Quick Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-gray-100 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">Filter By:</span>
            {CATEGORY_CHIPS.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParams({ category: cat })}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-green-700 text-white shadow-md shadow-green-700/20'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}

            {(search || selectedRegion !== 'All' || unescoOnly || selectedCategory !== 'All') && (
              <button
                onClick={clearAllFilters}
                className="ml-auto text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 shrink-0 px-2 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            <AnimatePresence mode="popLayout">
            {filteredItems.map((item: any, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {item.isUnesco && (
                    <div className="absolute top-4 right-4 bg-yellow-400/90 backdrop-blur-md text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      UNESCO
                    </div>
                  )}
                  {(item.region || item.category) && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                      {item.region || item.category}
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{item.name}</h3>
                  <div className="flex items-start text-gray-500 text-sm mb-5">
                    <MapPin className="w-5 h-5 mr-1.5 text-green-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item.location}</span>
                  </div>
                  <p className="text-gray-600 text-base mb-8 line-clamp-3 leading-relaxed">
                    {item.history ? item.history.replace(/\*/g, '') : ''}
                  </p>
                  <Link 
                    to={`/explore/${activeTab === 'heritages' ? 'heritage' : 'culture'}/${item._id}`}
                    className="inline-flex items-center justify-center w-full py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-green-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Explore {activeTab === 'heritages' ? 'Journey' : 'Culture'}
                  </Link>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
            
            {error ? (
              <div className="col-span-full text-center py-20">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-green-600 text-white rounded-lg">Try Again</button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-150 p-8 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results matching your filters</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  Try clearing your active search query or selecting a different category filter.
                </p>
                <button 
                  onClick={clearAllFilters} 
                  className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
