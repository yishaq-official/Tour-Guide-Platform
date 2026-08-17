import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Compass, Info, CheckCircle2, Car } from 'lucide-react';
import { MapWidget } from '../components/MapWidget';
import { WeatherWidget } from '../components/WeatherWidget';
import { API_URL } from '../config';

interface TouristHighlight {
  title: string;
  description: string;
}

interface Heritage {
  _id: string;
  name: string;
  history: string;
  location: string;
  image: string;
  isUnesco: boolean;
  category: string;
  region: string;
  quickFacts: Record<string, string>;
  touristHighlights: TouristHighlight[];
  travelerExperience: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export function HeritageDetail() {
  const { id } = useParams<{ id: string }>();
  const [heritage, setHeritage] = useState<Heritage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API_URL}/heritages/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch heritage details');
        return res.json();
      })
      .then(data => {
        setHeritage(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch heritage details", err);
        setError('Failed to load heritage details. Please check your connection and try again.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-32 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Oops!</h2>
        <p className="text-gray-600 text-lg mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-green-600 text-white rounded-lg">Try Again</button>
        <div className="mt-4">
          <Link to="/explore?tab=heritages" className="text-green-600 hover:underline">Return to Explore</Link>
        </div>
      </div>
    );
  }

  if (!heritage) {
    return (
      <div className="text-center py-32 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-900">Heritage not found</h2>
        <Link to="/explore?tab=heritages" className="text-green-600 mt-6 inline-block hover:underline text-lg">Return to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-24">
      {/* Hero Image Section */}
      <div className="relative h-[60vh] md:h-[75vh] w-full">
        <img 
          src={heritage.image} 
          alt={heritage.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <Link to="/explore?tab=heritages" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors text-sm font-semibold uppercase tracking-wider bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {heritage.isUnesco && (
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                  UNESCO World Heritage
                </span>
              )}
              <span className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                {heritage.region || heritage.category}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">
              {heritage.name}
            </h1>
            
            <div className="flex items-start md:items-center text-white/90 max-w-3xl">
              <MapPin className="w-6 h-6 mr-3 text-green-400 shrink-0 mt-1 md:mt-0" />
              <span className="text-xl md:text-2xl font-light drop-shadow-md">{heritage.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Quick Facts Grid */}
            {heritage.quickFacts && Object.keys(heritage.quickFacts).length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="bg-green-50/50 rounded-3xl p-8 border border-green-100"
              >
                <div className="flex items-center mb-8">
                  <Info className="w-8 h-8 text-green-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Quick Facts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(heritage.quickFacts).map(([key, value]) => (
                    <div key={key} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                      <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">{key}</h4>
                      <p className="text-gray-800 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\*/g, '') }}></p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* History Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Compass className="w-8 h-8 text-gray-900 mr-3" />
                History & Significance
              </h2>
              <div className="prose prose-lg prose-green max-w-none text-gray-700 leading-loose">
                {heritage.history?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\*/g, '') }} />
                ))}
              </div>
            </motion.section>

            {/* Tourist Highlights */}
            {heritage.touristHighlights && heritage.touristHighlights.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Highlights</h2>
                <div className="grid grid-cols-1 gap-6">
                  {heritage.touristHighlights.map((highlight, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 group">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors" dangerouslySetInnerHTML={{ __html: highlight.title.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\*/g, '') }}></h3>
                      <p className="text-gray-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: highlight.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\*/g, '') }}></p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Traveler Experience */}
            {heritage.travelerExperience && heritage.travelerExperience.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">What Travelers Experience</h2>
                <ul className="space-y-4">
                  {heritage.travelerExperience.map((exp, idx) => {
                    const [title, ...rest] = exp.split(': ');
                    const desc = rest.join(': ');
                    return (
                      <li key={idx} className="flex items-start bg-gray-50 p-6 rounded-2xl">
                        <CheckCircle2 className="w-8 h-8 text-green-500 mr-4 shrink-0 mt-1" />
                        <div>
                          <strong className="text-xl text-gray-900 block mb-2">{title}</strong>
                          <span className="text-gray-600 text-lg leading-relaxed">{desc || exp}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Location Map */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
                  <h3 className="text-xl font-bold">Interactive Map</h3>
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div className="h-64 w-full">
                  <MapWidget lat={heritage.coordinates.lat} lng={heritage.coordinates.lng} name={heritage.name} />
                </div>
                <div className="p-6 bg-gray-50">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    <strong>Location:</strong> {heritage.location}
                  </p>
                  <div className="flex items-start text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-200">
                    <Car className="w-6 h-6 mr-3 text-green-600 shrink-0" />
                    <span className="leading-relaxed">This site is accessible via domestic flights (Ethiopian Airlines) or organized overland tours departing from Addis Ababa.</span>
                  </div>
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Current Weather</h3>
                <WeatherWidget lat={heritage.coordinates.lat} lng={heritage.coordinates.lng} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
