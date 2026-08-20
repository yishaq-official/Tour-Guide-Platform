import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, CheckCircle2, X, Wifi, Coffee, Utensils, Car, Users, Clock, Info, Heart, Maximize2 } from 'lucide-react';
import { MapWidget } from '../components/MapWidget';
import { API_URL, apiFetch } from '../config';
import { useSession } from '../lib/auth-client';

interface RoomType {
  name: string;
  pricePerNight: number;
  capacity: number;
  image?: string;
}

interface Hotel {
  _id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  pricePerNight: number;
  image: string;
  gallery: string[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  roomTypes: RoomType[];
}

export function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: '',
    phone: '',
    guests: 1,
    roomType: '',
    specialRequests: ''
  });
  
  const [selectedRoomImage, setSelectedRoomImage] = useState<{ src: string, name: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API_URL}/services/hotels/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch hotel details');
        return res.json();
      })
      .then(data => {
        setHotel(data);
        if (data.roomTypes && data.roomTypes.length > 0) {
          setBookingData(prev => ({ ...prev, roomType: data.roomTypes[0].name }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    if (session) {
      apiFetch(`${API_URL}/user/favorites`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setIsFavorite(data.some((f: any) => f.itemId && (typeof f.itemId === 'string' ? f.itemId === id : f.itemId._id === id)));
          }
        })
        .catch(console.error);
    }
  }, [id, session]);

  const toggleFavorite = async () => {
    if (!session) return;
    setIsTogglingFavorite(true);
    try {
      const res = await apiFetch(`${API_URL}/user/favorites`, {
        method: 'POST',
        body: JSON.stringify({ itemId: id, itemModel: 'Hotel', userId: session?.user?.id || undefined })
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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel) return;

    setIsSubmitting(true);
    setBookingError('');

    // Client-side Validation
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    
    if (end <= start) {
      setBookingError('Check-out date must be after check-in date.');
      setIsSubmitting(false);
      return;
    }
    
    if (bookingData.guests < 1) {
      setBookingError('Number of guests must be at least 1.');
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedRoom = hotel.roomTypes.find(r => r.name === bookingData.roomType) || hotel.roomTypes[0];
      const pricePerUnit = selectedRoom ? selectedRoom.pricePerNight : hotel.pricePerNight;

      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const totalPrice = days * pricePerUnit;

      const response = await apiFetch(`${API_URL}/services/book`, {
        method: 'POST',
        body: JSON.stringify({
          itemId: hotel._id,
          itemModel: 'Hotel',
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          phone: bookingData.phone,
          guests: bookingData.guests,
          roomType: bookingData.roomType,
          specialRequests: bookingData.specialRequests,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          totalPrice,
          userId: session?.user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to create booking');

      setBookingSuccess(true);
    } catch (err) {
      console.error(err);
      setBookingError('An error occurred while confirming your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          <Link to="/services" className="text-green-600 hover:underline">Return to Services</Link>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-32 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-900">Hotel not found</h2>
        <Link to="/services" className="text-green-600 mt-6 inline-block hover:underline text-lg">Return to Services</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Gallery */}
      <div className="relative h-[60vh] md:h-[70vh] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 flex">
          {hotel.gallery && hotel.gallery.length > 0 ? (
            <>
              <div className="w-full md:w-2/3 h-full relative border-r border-white/10">
                <img src={hotel.gallery[0] || hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:flex flex-col w-1/3 h-full">
                <div className="h-1/2 relative border-b border-white/10">
                  <img src={hotel.gallery[1] || hotel.image} alt="Interior 1" className="w-full h-full object-cover" />
                </div>
                <div className="h-1/2 relative">
                  <img src={hotel.gallery[2] || hotel.image} alt="Interior 2" className="w-full h-full object-cover" />
                </div>
              </div>
            </>
          ) : (
            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover opacity-80" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 flex justify-between right-8 md:right-12">
          <Link to="/services" className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
          </Link>
          
          {session && (
            <button 
              onClick={toggleFavorite}
              disabled={isTogglingFavorite}
              className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all ${isFavorite ? 'bg-red-500/80 text-white' : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                  <Star className="w-3.5 h-3.5 mr-1 fill-current" /> {hotel.rating}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <MapPin className="w-3 h-3 inline mr-1" /> {hotel.location}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{hotel.name}</h1>
            </div>
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center">
              <span className="text-white/80 text-sm font-medium mb-1">Starting from</span>
              <div className="text-white font-bold text-4xl mb-4">${hotel.pricePerNight}<span className="text-lg text-white/60 font-normal">/night</span></div>
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
              >
                Reserve a Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About this Hotel</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{hotel.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {hotel.amenities.map((amenity, idx) => {
                  let Icon = Info;
                  if (amenity.toLowerCase().includes('wifi')) Icon = Wifi;
                  if (amenity.toLowerCase().includes('pool')) Icon = Coffee; // placeholder icon
                  if (amenity.toLowerCase().includes('restaurant')) Icon = Utensils;
                  if (amenity.toLowerCase().includes('parking')) Icon = Car;
                  if (amenity.toLowerCase().includes('spa')) Icon = CheckCircle2; // placeholder icon
                  
                  return (
                    <div key={idx} className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <Icon className="w-5 h-5 mr-3 text-green-600" />
                      <span className="font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Room Types</h2>
              <div className="space-y-6">
                {hotel.roomTypes && hotel.roomTypes.map((room, idx) => {
                  const roomImg = room.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=600';
                  return (
                    <div key={idx} className="flex flex-col md:flex-row border border-gray-200 rounded-3xl hover:border-green-500 transition-all bg-white overflow-hidden shadow-sm hover:shadow-md">
                      <div className="md:w-64 h-48 md:h-auto relative group cursor-pointer overflow-hidden shrink-0" onClick={() => setSelectedRoomImage({ src: roomImg, name: room.name })}>
                        <img 
                          src={roomImg} 
                          alt={room.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-2 rounded-full flex items-center shadow-md">
                            <Maximize2 className="w-3.5 h-3.5 mr-1" /> View Image
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center shrink-0">
                              <Users className="w-3 h-3 mr-1" /> Up to {room.capacity} Guests
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">
                            Enjoy a spacious, modern room layout complete with luxury bedding, high-speed Wi-Fi, air conditioning, and beautiful interior details.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-sm text-gray-500">Price per night</span>
                            <div className="text-2xl font-extrabold text-green-700">${room.pricePerNight}</div>
                          </div>
                          <button 
                            onClick={() => {
                              setBookingData(prev => ({ ...prev, roomType: room.name }));
                              setIsBookingModalOpen(true);
                            }}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-green-600/10 whitespace-nowrap text-center"
                          >
                            Select Room
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Clock className="w-5 h-5 mr-2 text-green-600"/> Policies</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Check-in</h4>
                  <p className="text-gray-900 font-medium">{hotel.policies?.checkIn || '2:00 PM'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Check-out</h4>
                  <p className="text-gray-900 font-medium">{hotel.policies?.checkOut || '11:00 AM'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Cancellation</h4>
                  <p className="text-gray-900 font-medium leading-relaxed">{hotel.policies?.cancellation || 'Check specific room policy.'}</p>
                </div>
              </div>
            </section>

            <section className="h-80 rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
              <MapWidget 
                name={hotel.name} 
                lat={hotel.coordinates?.lat || 9.03} 
                lng={hotel.coordinates?.lng || 38.74} 
              />
            </section>
          </div>

        </div>
      </div>

      {/* Expanded Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                <h3 className="text-2xl font-bold text-gray-900">Complete Reservation</h3>
                <button onClick={() => setIsBookingModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {bookingSuccess ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Reservation Confirmed!</h3>
                    <p className="text-gray-600 text-lg mb-8">Thank you, {bookingData.customerName}. Your {bookingData.roomType} at {hotel.name} is confirmed. We've sent the details to {bookingData.customerEmail}.</p>
                    <button onClick={() => setIsBookingModalOpen(false)} className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                      Back to Hotel
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    {bookingError && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">
                        {bookingError}
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">Stay Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                          <input type="date" required value={bookingData.startDate} onChange={e => setBookingData({...bookingData, startDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                          <input type="date" required min={bookingData.startDate} value={bookingData.endDate} onChange={e => setBookingData({...bookingData, endDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                          <select required value={bookingData.roomType} onChange={e => setBookingData({...bookingData, roomType: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                            {hotel.roomTypes && hotel.roomTypes.map((rt, i) => (
                              <option key={i} value={rt.name}>{rt.name} - ${rt.pricePerNight}/night</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                          <input type="number" required min="1" max="10" value={bookingData.guests} onChange={e => setBookingData({...bookingData, guests: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" required placeholder="John Doe" value={bookingData.customerName} onChange={e => setBookingData({...bookingData, customerName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" required placeholder="+251 911 234 567" value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" required placeholder="john@example.com" value={bookingData.customerEmail} onChange={e => setBookingData({...bookingData, customerEmail: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                        <textarea rows={3} placeholder="Late check-in, extra pillows, dietary requirements..." value={bookingData.specialRequests} onChange={e => setBookingData({...bookingData, specialRequests: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none resize-none"></textarea>
                      </div>
                    </div>

                    <div className="pt-4 mt-6 border-t border-gray-100">
                      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-green-600/30">
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          "Confirm & Pay at Hotel"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Room Image Lightbox Modal */}
      <AnimatePresence>
        {selectedRoomImage && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoomImage(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-transparent overflow-hidden z-10 flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setSelectedRoomImage(null)} 
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-white/10 p-2.5 rounded-full z-20 backdrop-blur-sm border border-white/15"
              >
                <X className="w-5 h-5" />
              </button>
              
              <img 
                src={selectedRoomImage.src} 
                alt={selectedRoomImage.name} 
                className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10" 
              />
              
              <div className="mt-4 text-white font-bold text-lg text-center backdrop-blur-md bg-black/45 px-6 py-2.5 rounded-full border border-white/10">
                {selectedRoomImage.name}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
