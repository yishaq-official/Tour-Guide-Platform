import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, CreditCard, Trash2, MapPin, Loader2, ArrowRight, Clock, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL, apiFetch } from '../config';

export function MyTrips() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'itinerary' | 'bookings'>('favorites');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    } else {
      // Fetch itinerary
      setLoading(false);
    }
  }, [activeTab]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/user/favorites`);
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/user/bookings`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const res = await apiFetch(`${API_URL}/user/bookings/${id}/cancel`, {
        method: 'PUT'
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFavorite = async (itemId: string, itemModel: string) => {
    try {
      const res = await apiFetch(`${API_URL}/user/favorites`, {
        method: 'POST',
        body: JSON.stringify({ itemId, itemModel })
      });
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.itemId._id !== itemId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Trips</h1>
          <p className="mt-2 text-lg text-gray-600">Manage your saved places and planned itineraries.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center px-6 py-3 text-sm font-bold rounded-t-xl transition-colors whitespace-nowrap ${
              activeTab === 'favorites' 
                ? 'bg-white text-green-700 border-t border-l border-r border-gray-200 shadow-[0_4px_0_0_white]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-4 h-4 mr-2" /> Favorites
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex items-center px-6 py-3 text-sm font-bold rounded-t-xl transition-colors whitespace-nowrap ${
              activeTab === 'itinerary' 
                ? 'bg-white text-green-700 border-t border-l border-r border-gray-200 shadow-[0_4px_0_0_white]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" /> Itinerary
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : activeTab === 'favorites' ? (
            <div>
              {favorites.length === 0 ? (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-500 mb-6">Start saving places you'd like to visit.</p>
                  <Link to="/explore" className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
                    Explore Destinations <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((fav) => (
                    <motion.div 
                      key={fav._id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={fav.itemId.image} 
                          alt={fav.itemId.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <button 
                          onClick={(e) => { e.preventDefault(); removeFavorite(fav.itemId._id, fav.itemModel); }}
                          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Link 
                        to={
                          fav.itemModel === 'Heritage' ? `/explore/heritage/${fav.itemId._id}` :
                          fav.itemModel === 'Culture' ? `/explore/culture/${fav.itemId._id}` :
                          fav.itemModel === 'Hotel' ? `/services/hotel/${fav.itemId._id}` :
                          `/services/vehicle/${fav.itemId._id}`
                        }
                        className="block p-5"
                      >
                        <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">{fav.itemModel}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{fav.itemId.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1 shrink-0" />
                          <span className="truncate">{fav.itemId.location || fav.itemId.region}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'itinerary' ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Itinerary Builder</h3>
              <p className="text-gray-500">Coming soon! Organize your saved places into a day-by-day plan.</p>
            </div>
          ) : activeTab === 'bookings' ? (
            <div>
              {bookings.length === 0 ? (
                <div className="text-center py-24">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-500 mb-4">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">You haven't booked any hotels or vehicles yet.</p>
                  <Link to="/services" className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
                    Browse Services <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                      <div className="md:w-64 h-48 md:h-auto shrink-0 relative">
                        <img src={booking.itemId?.image || 'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=600&auto=format&fit=crop'} alt="Booking" className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            booking.status === 'Confirmed' ? 'bg-green-500 text-white' : 
                            booking.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">{booking.itemModel}</div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{booking.itemId?.name || 'Service Unavailable'}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {booking.itemId?.location || booking.pickupLocation}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-sm text-gray-500">Total Price</span>
                            <div className="text-xl font-bold text-gray-900">${booking.totalPrice}</div>
                          </div>
                          {booking.status === 'Confirmed' && (
                            <button 
                              onClick={() => cancelBooking(booking._id)}
                              className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center"
                            >
                              <Ban className="w-4 h-4 mr-2" /> Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
