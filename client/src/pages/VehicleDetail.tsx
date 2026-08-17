import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, X, Users, Cog, Star, ShieldCheck, MapPin, Fuel, Calendar, PhoneCall, Info } from 'lucide-react';
import { API_URL } from '../config';

interface Provider {
  name: string;
  rating: number;
  phone: string;
}

interface Policies {
  mileage: string;
  fuel: string;
  cancellation: string;
}

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  image: string;
  gallery: string[];
  description: string;
  provider: Provider;
  features: string[];
  policies: Policies;
  available: boolean;
}

export function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: '',
    phone: '',
    guests: 1,
    pickupLocation: '',
    dropoffLocation: '',
    specialRequests: ''
  });

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API_URL}/services/vehicles/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch vehicle details');
        return res.json();
      })
      .then(data => {
        setVehicle(data);
        if (data) {
          setBookingData(prev => ({ ...prev, guests: data.seats || 1 }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;

    setIsSubmitting(true);
    setBookingError('');

    // Client-side Validation
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    
    if (end < start) {
      setBookingError('Drop-off date cannot be before pick-up date.');
      setIsSubmitting(false);
      return;
    }
    
    if (bookingData.guests < 1 || bookingData.guests > vehicle.seats) {
      setBookingError(`Number of passengers must be between 1 and ${vehicle.seats}.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const totalPrice = days * vehicle.pricePerDay;

      const response = await fetch(`${API_URL}/services/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: vehicle._id,
          itemModel: 'Vehicle',
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          phone: bookingData.phone,
          guests: bookingData.guests,
          pickupLocation: bookingData.pickupLocation,
          dropoffLocation: bookingData.dropoffLocation,
          specialRequests: bookingData.specialRequests,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          totalPrice
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

  if (!vehicle) {
    return (
      <div className="text-center py-32 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-900">Vehicle not found</h2>
        <Link to="/services" className="text-green-600 mt-6 inline-block hover:underline text-lg">Return to Services</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Gallery */}
      <div className="relative h-[50vh] md:h-[60vh] bg-gray-100 overflow-hidden pt-20">
        <div className="absolute top-24 left-8 md:top-28 md:left-12 z-20">
          <Link to="/services" className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors text-sm font-semibold uppercase tracking-wider bg-white/80 px-4 py-2 rounded-full backdrop-blur-md border border-gray-200 shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
          </Link>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="text-[20vw] font-black uppercase text-gray-900 leading-none tracking-tighter mix-blend-overlay">
            {vehicle.type}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 h-full pb-8">
            <div className="w-full md:w-1/2 flex flex-col justify-center mt-16 md:mt-0">
              <div className="inline-flex items-center bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit uppercase tracking-wide shadow-sm">
                {vehicle.available ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Available for Rent</>
                ) : (
                  <><X className="w-3.5 h-3.5 mr-1 text-red-600" /> <span className="text-red-700">Currently Rented</span></>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">{vehicle.name}</h1>
              <div className="text-xl text-gray-500 font-medium mb-6 uppercase tracking-widest">{vehicle.type}</div>
              
              <div className="flex gap-4">
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Users className="w-5 h-5"/></div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Capacity</div>
                    <div className="font-bold text-gray-900">{vehicle.seats} Seats</div>
                  </div>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-xl text-purple-600"><Cog className="w-5 h-5"/></div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-bold">Gearbox</div>
                    <div className="font-bold text-gray-900">{vehicle.transmission}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 h-full flex items-center justify-center relative mt-8 md:mt-0">
              <motion.img 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src={vehicle.image} 
                alt={vehicle.name} 
                className="w-full max-w-lg object-contain drop-shadow-2xl z-20 mix-blend-multiply" 
              />
              {/* Optional multi-view thumbnails could go here if we had side-profile images */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-2/3 space-y-12">
            
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Overview</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{vehicle.description}</p>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vehicle.features && vehicle.features.map((feature, idx) => {
                  let Icon = CheckCircle2;
                  if (feature.toLowerCase().includes('air')) Icon = Fuel; 
                  if (feature.toLowerCase().includes('gps') || feature.toLowerCase().includes('nav')) Icon = MapPin;
                  if (feature.toLowerCase().includes('4wd') || feature.toLowerCase().includes('4x4')) Icon = ShieldCheck;
                  
                  return (
                    <div key={idx} className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <Icon className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                      <span className="font-medium text-sm">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Provider & Policies */}
            <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-green-600"/> Provider Info</h3>
                  {vehicle.provider && (
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="font-bold text-gray-900 text-lg mb-1">{vehicle.provider.name}</div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-current" /> {vehicle.provider.rating}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">Verified Partner</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneCall className="w-4 h-4 mr-2 text-gray-400"/> {vehicle.provider.phone}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:w-1/2 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center"><Info className="w-5 h-5 mr-2 text-green-600"/> Rental Policies</h3>
                  {vehicle.policies && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 shrink-0"/>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Mileage</div>
                          <div className="text-sm text-gray-600">{vehicle.policies.mileage}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Fuel className="w-5 h-5 text-gray-400 shrink-0"/>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Fuel Policy</div>
                          <div className="text-sm text-gray-600">{vehicle.policies.fuel}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 shrink-0"/>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Cancellation</div>
                          <div className="text-sm text-gray-600">{vehicle.policies.cancellation}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
              <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-6">
                <div>
                  <span className="text-gray-500 text-sm font-medium uppercase tracking-wider block mb-1">Daily Rate</span>
                  <div className="text-4xl font-extrabold text-gray-900">${vehicle.pricePerDay}</div>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 text-sm text-gray-600 font-medium">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-3 text-green-500"/> Instant Confirmation</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-3 text-green-500"/> Secure Payment at Pick-up</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-3 text-green-500"/> 24/7 Roadside Assistance</li>
              </ul>
              
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                disabled={!vehicle.available}
                className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white font-bold rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
              >
                {vehicle.available ? 'Proceed to Booking' : 'Not Available'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Expanded Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <img src={vehicle.image} alt={vehicle.name} className="w-16 object-contain mix-blend-multiply" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Book {vehicle.name}</h3>
                    <p className="text-sm text-gray-500">${vehicle.pricePerDay} / day</p>
                  </div>
                </div>
                <button onClick={() => setIsBookingModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white border border-gray-200 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                {bookingSuccess ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Rental Confirmed!</h3>
                    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Thank you, {bookingData.customerName}. Your reservation for the {vehicle.name} is confirmed. Details have been sent to {bookingData.customerEmail}.</p>
                    <button onClick={() => setIsBookingModalOpen(false)} className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-8">
                    {bookingError && (
                      <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">
                        {bookingError}
                      </div>
                    )}
                    
                    {/* Dates & Locations */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
                      <div className="absolute top-0 left-6 -translate-y-1/2 bg-white px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Itinerary</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pick-up Date</label>
                            <input type="date" required value={bookingData.startDate} onChange={e => setBookingData({...bookingData, startDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pick-up Location</label>
                            <select required value={bookingData.pickupLocation} onChange={e => setBookingData({...bookingData, pickupLocation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                              <option value="" disabled>Select location</option>
                              <option value="Bole International Airport">Bole International Airport (ADD)</option>
                              <option value="City Center Office">City Center Office, Addis Ababa</option>
                              <option value="Custom Location">Custom Hotel Drop-off (Add to requests)</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Drop-off Date</label>
                            <input type="date" required min={bookingData.startDate} value={bookingData.endDate} onChange={e => setBookingData({...bookingData, endDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Drop-off Location</label>
                            <select required value={bookingData.dropoffLocation} onChange={e => setBookingData({...bookingData, dropoffLocation: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                              <option value="" disabled>Select location</option>
                              <option value="Bole International Airport">Bole International Airport (ADD)</option>
                              <option value="City Center Office">City Center Office, Addis Ababa</option>
                              <option value="Custom Location">Custom Location (Add to requests)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Driver Details */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
                      <div className="absolute top-0 left-6 -translate-y-1/2 bg-white px-2 text-sm font-bold text-gray-500 uppercase tracking-wider">Driver Details</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                          <input type="text" required placeholder="John Doe" value={bookingData.customerName} onChange={e => setBookingData({...bookingData, customerName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                          <input type="tel" required placeholder="+251 911 234 567" value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                          <input type="email" required placeholder="john@example.com" value={bookingData.customerEmail} onChange={e => setBookingData({...bookingData, customerEmail: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Passengers</label>
                          <input type="number" required min="1" max={vehicle.seats} value={bookingData.guests} onChange={e => setBookingData({...bookingData, guests: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-1">Special Requests (Optional)</label>
                          <textarea rows={2} placeholder="Child seat needed, exact drop-off hotel address..." value={bookingData.specialRequests} onChange={e => setBookingData({...bookingData, specialRequests: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none resize-none"></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-green-600/30">
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          "Confirm Reservation"
                        )}
                      </button>
                      <p className="text-center text-gray-500 text-sm mt-4 font-medium">You won't be charged until pick-up.</p>
                    </div>
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
