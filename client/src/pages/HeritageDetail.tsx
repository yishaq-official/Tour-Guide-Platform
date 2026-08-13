import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Compass } from 'lucide-react';
import { MapWidget } from '../components/MapWidget';

interface Heritage {
  _id: string;
  name: string;
  description: string;
  history: string;
  location: string;
  image: string;
  isUnesco: boolean;
  category: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export function HeritageDetail() {
  const { id } = useParams<{ id: string }>();
  const [heritage, setHeritage] = useState<Heritage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/heritages/${id}`)
      .then(res => res.json())
      .then(data => {
        setHeritage(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch heritage details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!heritage) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Heritage not found</h2>
        <Link to="/heritages" className="text-green-600 mt-4 inline-block hover:underline">Return to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-20">
      {/* Hero Image Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <img 
          src={heritage.image} 
          alt={heritage.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/heritages" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {heritage.isUnesco && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  UNESCO World Heritage
                </span>
              )}
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                {heritage.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              {heritage.name}
            </h1>
            
            <div className="flex items-center text-white/90">
              <MapPin className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-lg">{heritage.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {heritage.description}
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Historical Context</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {heritage.history}
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
              <MapWidget lat={heritage.coordinates.lat} lng={heritage.coordinates.lng} name={heritage.name} />
            </motion.section>
          </div>

          {/* Sidebar / Quick Facts */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Facts</h3>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Category</p>
                    <p className="text-gray-900 font-semibold">{heritage.category}</p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Status</p>
                    <p className="text-gray-900 font-semibold">{heritage.isUnesco ? "UNESCO Listed" : "National Heritage"}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">
                  Plan a Trip Here
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
