import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Filter, Landmark, Sparkles, ScrollText, Users, Award } from 'lucide-react';
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
  // specific culture fields if needed
}

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'heritages' ? 'heritages' : 'cultures';
  const search = searchParams.get('search') || '';
  const selectedRegion = searchParams.get('region') || 'All';
  
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'All') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };
  
  const handleTabChange = (tab: 'cultures' | 'heritages') => {
    updateParams({ tab, search: '', region: 'All' });
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
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = activeTab === 'heritages' ? (selectedRegion === 'All' || item.region === selectedRegion) : true;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-16">
      {/* Immersive Hero Banner & Stats Bar */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 text-white relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 mb-12 shadow-xl">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
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
        
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-end items-end mb-12 gap-6">
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {activeTab === 'heritages' && (
              <div className="relative w-full sm:w-64">
                <select
                  value={selectedRegion}
                  onChange={(e) => updateParams({ region: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none cursor-pointer shadow-sm"
                >
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            )}

            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={search}
                onChange={(e) => updateParams({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow shadow-sm"
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

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
                    <div className="absolute top-4 right-4 bg-yellow-400/90 backdrop-blur-md text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
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
                    {item.history.replace(/\*/g, '')}
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
              <div className="col-span-full text-center py-20 text-gray-500 text-lg">
                <p className="mb-4">No results found for "{search}"</p>
                <button onClick={() => updateParams({ search: '', region: 'All' })} className="text-green-600 font-medium hover:underline">Clear Filters</button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
