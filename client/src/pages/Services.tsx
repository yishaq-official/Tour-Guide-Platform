import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CarFront, MapPin, Star, Users, Cog, CheckCircle2, X } from 'lucide-react';
import { API_URL } from '../config';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
}

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  image: string;
  available: boolean;
}

export function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'vehicles' ? 'vehicles' : 'hotels';
  
  const handleTabChange = (tab: 'hotels' | 'vehicles') => {
    setSearchParams({ tab }, { replace: true });
  };
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; item: Hotel | Vehicle | null; type: 'hotel' | 'vehicle' }>({ isOpen: false, item: null, type: 'hotel' });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingFormData, setBookingFormData] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: ''
  });

  useEffect(() => {
    setLoading(true);
    setError('');
    const fetchServices = async () => {
      try {
        const [hotelsRes, vehiclesRes] = await Promise.all([
          fetch(`${API_URL}/services/hotels`),
          fetch(`${API_URL}/services/vehicles`)
        ]);
        
        if (!hotelsRes.ok || !vehiclesRes.ok) {
          throw new Error('Failed to fetch services data');
        }
        
        const hotelsData = await hotelsRes.json();
        const vehiclesData = await vehiclesRes.json();
        
        setHotels(hotelsData);
        setVehicles(vehiclesData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch services", err);
        setError('Failed to load services. Please check your connection and try again.');
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModal.item) return;

    setIsSubmitting(true);
    setBookingError('');

    try {
      const isHotel = bookingModal.type === 'hotel';
      const pricePerUnit = isHotel 
        ? (bookingModal.item as Hotel).pricePerNight 
        : (bookingModal.item as Vehicle).pricePerDay;

      // Calculate total price based on dates
      const start = new Date(bookingFormData.startDate);
      const end = new Date(bookingFormData.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const totalPrice = days * pricePerUnit;

      const response = await fetch(`${API_URL}/services/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: bookingModal.item._id,
          itemModel: isHotel ? 'Hotel' : 'Vehicle',
          customerName: bookingFormData.customerName,
          customerEmail: bookingFormData.customerEmail,
          startDate: bookingFormData.startDate,
          endDate: bookingFormData.endDate,
          totalPrice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setBookingSuccess(true);
    } catch (err) {
      console.error(err);
      setBookingError('An error occurred while confirming your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gray-50/50 min-h-screen pb-24">
      {/* Immersive Hero Header */}
      <div className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-green-950 text-white py-16 sm:py-20 mb-12 rounded-b-3xl sm:rounded-b-[2.5rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/25 to-green-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest mb-6 border border-emerald-400/40 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Building2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Ethiopian Hospitality & Transport</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6"
          >
            Premium Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-200">Services</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Book verified luxury accommodations and reliable vehicle rentals to make your journey across Ethiopia effortless and memorable.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Custom Tabs Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 shadow-md inline-flex gap-2">
            <button
              onClick={() => handleTabChange('hotels')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'hotels' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Hotels & Stays
            </button>
            <button
              onClick={() => handleTabChange('vehicles')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'vehicles' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/20 scale-[1.02]' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
              }`}
            >
              <CarFront className="w-4 h-4" />
              Car Rentals
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-green-600 text-white rounded-lg">Try Again</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'hotels' && hotels.map((hotel, index) => (
              <motion.div 
                key={hotel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className="relative h-56">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {hotel.rating}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{hotel.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 text-green-600" />
                    {hotel.location}
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {hotel.description}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${hotel.pricePerNight}</span>
                      <span className="text-gray-500 text-sm"> / night</span>
                    </div>
                    <Link 
                      to={`/services/hotel/${hotel._id}`}
                      className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeTab === 'vehicles' && vehicles.map((vehicle, index) => (
              <motion.div 
                key={vehicle._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className="relative h-56 bg-gray-100 flex items-center justify-center p-4">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-contain mix-blend-multiply" />
                  {vehicle.available && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Available
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{vehicle.type}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">{vehicle.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {vehicle.seats} Seats
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Cog className="w-4 h-4 mr-2 text-gray-400" />
                      {vehicle.transmission}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${vehicle.pricePerDay}</span>
                      <span className="text-gray-500 text-sm"> / day</span>
                    </div>
                    <Link 
                      to={`/services/vehicle/${vehicle._id}`}
                      className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal.isOpen && bookingModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden z-10"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">
                  {bookingModal.type === 'hotel' ? 'Book Hotel' : 'Rent Vehicle'}
                </h3>
                <button 
                  onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                  <img src={bookingModal.item.image} alt={bookingModal.item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900">{bookingModal.item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {bookingModal.type === 'hotel' 
                        ? `$${(bookingModal.item as Hotel).pricePerNight} / night` 
                        : `$${(bookingModal.item as Vehicle).pricePerDay} / day`}
                    </p>
                  </div>
                </div>

                {bookingSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h3>
                    <p className="text-gray-600">Your booking was successfully processed. Check your email for details.</p>
                    <button 
                      onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
                      className="mt-6 w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    {bookingError && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
                        {bookingError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {bookingModal.type === 'hotel' ? 'Check-in' : 'Pick-up'}
                        </label>
                        <input 
                          type="date" 
                          required 
                          value={bookingFormData.startDate}
                          onChange={e => setBookingFormData({...bookingFormData, startDate: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {bookingModal.type === 'hotel' ? 'Check-out' : 'Drop-off'}
                        </label>
                        <input 
                          type="date" 
                          required 
                          min={bookingFormData.startDate}
                          value={bookingFormData.endDate}
                          onChange={e => setBookingFormData({...bookingFormData, endDate: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="John Doe" 
                        value={bookingFormData.customerName}
                        onChange={e => setBookingFormData({...bookingFormData, customerName: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john@example.com" 
                        value={bookingFormData.customerEmail}
                        onChange={e => setBookingFormData({...bookingFormData, customerEmail: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" 
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors mt-2 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        "Confirm Reservation"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
