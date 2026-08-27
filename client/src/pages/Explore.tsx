import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Search, Filter, Landmark, ScrollText, Users, Award, 
  Star, X, RotateCcw, ArrowRight, AlertCircle
} from 'lucide-react';
import { API_URL } from '../config';
import { SkeletonGrid } from '../components/SkeletonCard';
import { useToast } from '../context/ToastContext';

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
  const { showToast } = useToast();
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
      showToast('Failed to load explore catalog data', 'error', 'Network Error');
      setLoading(false);
    });
  }, [showToast]);

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
    showToast('Search & filters reset to default', 'info', 'Filters Cleared');
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-16">
      {/* Immersive Hero Banner & Stats Bar */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 text-white relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 mb-4 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
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
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
            {filteredItems.map((item: any, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group border border-gray-150 flex flex-col h-full"
              >
                {/* Card Header & Image */}
                <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Dark Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Top Left Tag */}
                  {(item.region || item.category) && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md border border-gray-150/60 tracking-tight">
                      {item.region || item.category}
                    </div>
                  )}

                  {/* Top Right UNESCO Gold Badge */}
                  {item.isUnesco && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-950" />
                      UNESCO
                    </div>
                  )}
                </div>
                
                {/* Card Content Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-snug group-hover:text-green-700 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center text-emerald-700 font-semibold text-xs mb-4">
                      <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-emerald-600" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm mb-6 line-clamp-3 leading-relaxed">
                      {item.history ? item.history.replace(/\*/g, '') : ''}
                    </p>
                  </div>

                  {/* Card Footer Button */}
                  <Link 
                    to={`/explore/${activeTab === 'heritages' ? 'heritage' : 'culture'}/${item._id}`}
                    className="inline-flex items-center justify-between w-full py-3.5 px-5 bg-gray-900 group-hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all duration-300 shadow-md group-hover:shadow-green-700/25"
                  >
                    <span>Discover {activeTab === 'heritages' ? 'Journey' : 'Tradition'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
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
                  {search ? `We couldn't find any items matching "${search}".` : "No heritage or cultural items match your selected filters."}
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
