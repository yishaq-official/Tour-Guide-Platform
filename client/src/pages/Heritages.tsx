import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';

interface Heritage {
  _id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  isUnesco: boolean;
  category: string;
}

export function Heritages() {
  const [heritages, setHeritages] = useState<Heritage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // In production, you would fetch from the real backend URL
    // e.g. import.meta.env.VITE_API_URL + '/api/heritages'
    fetch('http://localhost:3000/api/heritages')
      .then(res => res.json())
      .then(data => {
        setHeritages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch heritages", err);
        setLoading(false);
      });
  }, []);

  const filteredHeritages = heritages.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Heritages</h1>
            <p className="text-gray-600 max-w-2xl text-lg">
              Explore the rich historical and natural wonders of Ethiopia. From ancient obelisks to breathtaking national parks.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search heritages..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-shadow"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHeritages.map((heritage, index) => (
              <motion.div 
                key={heritage._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={heritage.image} 
                    alt={heritage.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {heritage.isUnesco && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      UNESCO
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {heritage.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{heritage.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-green-600" />
                    {heritage.location}
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {heritage.description}
                  </p>
                  <Link 
                    to={`/heritages/${heritage._id}`}
                    className="inline-flex items-center justify-center w-full py-2.5 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
