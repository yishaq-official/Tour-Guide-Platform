import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, CarFront, MapPin, Star, Users, Cog, CheckCircle2 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'hotels' | 'vehicles'>('hotels');
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchServices = async () => {
      try {
        const [hotelsRes, vehiclesRes] = await Promise.all([
          fetch('http://localhost:3000/api/services/hotels'),
          fetch('http://localhost:3000/api/services/vehicles')
        ]);
        
        const hotelsData = await hotelsRes.json();
        const vehiclesData = await vehiclesRes.json();
        
        setHotels(hotelsData);
        setVehicles(vehiclesData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch services", err);
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Services</h1>
          <p className="text-lg text-gray-600">
            Book the best accommodations and reliable transportation to make your Ethiopian journey unforgettable.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'hotels' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Hotels & Stays
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'vehicles' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
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
                    <button className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      Book Now
                    </button>
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
                    <button className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      Rent Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
