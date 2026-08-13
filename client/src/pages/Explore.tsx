import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Filter } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'cultures' | 'heritages'>('cultures');
  
  const [heritages, setHeritages] = useState<Heritage[]>([]);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/api/heritages').then(res => res.json()),
      fetch('http://localhost:5000/api/cultures').then(res => res.json())
    ])
    .then(([heritagesData, culturesData]) => {
      setHeritages(heritagesData);
      setCultures(culturesData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch data", err);
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
    <div className="w-full bg-[#f8f9fa] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Explore Ethiopia</h1>
          
          <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl mb-8 shadow-inner">
            <button
              onClick={() => setActiveTab('cultures')}
              className={`px-8 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
                activeTab === 'cultures' 
                  ? 'bg-white text-green-700 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cultures & Festivals
            </button>
            <button
              onClick={() => setActiveTab('heritages')}
              className={`px-8 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
                activeTab === 'heritages' 
                  ? 'bg-white text-green-700 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Heritage Sites
            </button>
          </div>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {activeTab === 'cultures' 
              ? "Discover the vibrant, living traditions and spectacular festivals that have defined Ethiopian identity for millennia."
              : "Explore the rich historical and natural wonders of Ethiopia. From ancient obelisks to breathtaking national parks."
            }
          </p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-end items-end mb-12 gap-6">
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {activeTab === 'heritages' && (
              <div className="relative w-full sm:w-64">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
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
                onChange={(e) => setSearch(e.target.value)}
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
                    {item.history}
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
            
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 text-lg">
                No results found for "{search}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
