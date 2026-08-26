import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Compass, Info, CheckCircle2, Car, Heart, 
  Volume2, VolumeX, Star, Calendar, Landmark, Globe, Award, Sparkles 
} from 'lucide-react';
import { MapWidget } from '../components/MapWidget';
import { WeatherWidget } from '../components/WeatherWidget';
import { API_URL, apiFetch } from '../config';
import { useSession } from '../lib/auth-client';

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
  
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudioGuide = () => {
    if (!('speechSynthesis' in window) || !heritage) return;
    
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${heritage.name}. Located in ${heritage.location}. ${heritage.history.replace(/\*/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

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
      
    if (session) {
      apiFetch(`${API_URL}/user/favorites`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setIsFavorite(data.some((f: any) => f.itemId && f.itemId._id === id || f.itemId === id));
          }
        })
        .catch(console.error);
    }
  }, [id, session]);

  const toggleFavorite = async () => {
    if (!session) {
      return;
    }
    setIsTogglingFavorite(true);
    try {
      const res = await apiFetch(`${API_URL}/user/favorites`, {
        method: 'POST',
        body: JSON.stringify({ itemId: id, itemModel: 'Heritage' })
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

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
      <div className="relative h-[65vh] md:h-[80vh] w-full bg-gray-900">
        <img 
          src={heritage.image} 
          alt={heritage.name} 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/30" />
        
        {/* Top Glassmorphic Navigation Bar */}
        <div className="absolute top-6 left-6 right-6 md:top-10 md:left-10 md:right-10 z-20 flex justify-between items-center">
          <Link to="/explore?tab=heritages" className="inline-flex items-center text-white/90 hover:text-white transition-all text-xs font-black uppercase tracking-wider bg-black/40 hover:bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Audio Reader Guide Button */}
            <button
              onClick={toggleAudioGuide}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all shadow-lg border ${
                isPlayingAudio 
                  ? 'bg-green-600 text-white border-green-400 animate-pulse' 
                  : 'bg-black/40 hover:bg-green-700/80 text-white border-white/20'
              }`}
              title="Listen to Heritage Guide"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-green-400" />}
              <span>{isPlayingAudio ? 'Pause Audio' : 'Audio Guide'}</span>
            </button>

            {session && (
              <button 
                onClick={toggleFavorite}
                disabled={isTogglingFavorite}
                className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg ${isFavorite ? 'bg-red-500/90 text-white' : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Hero Title & Badges */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {heritage.isUnesco && (
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide flex items-center gap-1.5 border border-amber-300">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  UNESCO World Heritage
                </span>
              )}
              <span className="bg-emerald-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide border border-emerald-500">
                {heritage.region || heritage.category}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
              {heritage.name}
            </h1>
            
            <div className="flex items-center text-white/90 max-w-3xl mb-6">
              <MapPin className="w-5 h-5 mr-2 text-green-400 shrink-0" />
              <span className="text-base md:text-lg font-medium drop-shadow-md">{heritage.location}</span>
            </div>

            {/* Prominent Hero Audio Button */}
            <button
              onClick={toggleAudioGuide}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-2xl border ${
                isPlayingAudio 
                  ? 'bg-green-500 text-white border-green-300 animate-pulse scale-[1.02]' 
                  : 'bg-white text-gray-900 hover:bg-green-600 hover:text-white border-white/40'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-5 h-5 text-white" />
                  <span>Pause Audio Narration</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 text-green-600" />
                  <span>Listen to Audio Guide</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Prominent Audio Player Banner Card */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-800 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isPlayingAudio ? 'bg-green-500 text-white animate-bounce' : 'bg-white/10 text-green-400'}`}>
              <Volume2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-green-400">Interactive Audio Experience</span>
              <h3 className="text-xl font-bold text-white">Audio Guide Narration</h3>
              <p className="text-xs sm:text-sm text-gray-300">Listen to an AI-narrated historical overview of {heritage.name}</p>
            </div>
          </div>

          <button
            onClick={toggleAudioGuide}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shrink-0 flex items-center justify-center gap-2 ${
              isPlayingAudio 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? 'Stop Narration' : 'Play Audio Guide'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Quick Facts Grid */}
            {heritage.quickFacts && Object.keys(heritage.quickFacts).length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="bg-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mr-3 shadow-md">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Key Facts & Details</h2>
                    <p className="text-xs text-gray-500 font-medium">Essential technical and historical information at a glance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(heritage.quickFacts).map(([key, value]) => {
                    const keyLower = key.toLowerCase();
                    let IconComponent = Sparkles;
                    
                    if (keyLower.includes('era') || keyLower.includes('built') || keyLower.includes('date') || keyLower.includes('period') || keyLower.includes('century') || keyLower.includes('year')) {
                      IconComponent = Calendar;
                    } else if (keyLower.includes('architect') || keyLower.includes('structure') || keyLower.includes('style') || keyLower.includes('design') || keyLower.includes('type') || keyLower.includes('material')) {
                      IconComponent = Landmark;
                    } else if (keyLower.includes('region') || keyLower.includes('location') || keyLower.includes('city') || keyLower.includes('place') || keyLower.includes('altitude')) {
                      IconComponent = Globe;
                    } else if (keyLower.includes('significan') || keyLower.includes('status') || keyLower.includes('unesco') || keyLower.includes('importance')) {
                      IconComponent = Award;
                    }

                    return (
                      <div 
                        key={key} 
                        className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-150 flex items-start gap-4 group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 shadow-inner">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1">
                            {key}
                          </h4>
                          <p 
                            className="text-gray-800 text-xs sm:text-sm font-semibold leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\*/g, '') }}
                          />
                        </div>
                      </div>
                    );
                  })}
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

              {/* RAG AI Assistant Card */}
              <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 text-white rounded-3xl p-6 shadow-xl border border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Ask AI RAG Assistant</h3>
                    <p className="text-xs text-emerald-300">Contextual query for {heritage.name}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                  Get instant historical answers, hotel recommendations, and transportation advice for visiting {heritage.name}.
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md gap-2"
                >
                  <span>Book Nearby Stays & Vehicles</span>
                </Link>
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
