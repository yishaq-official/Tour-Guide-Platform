import { useState, useEffect } from 'react';
import { 
  Building, Plus, Trash2, Edit3, Loader2, Star, MapPin, Users, X, 
  DollarSign, Calendar, Clock, ClipboardList, Info, Check, AlertTriangle, 
  Car, Key, Compass, Settings, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { API_URL, apiFetch } from '../config';
import { useSession } from '../lib/auth-client';
import { PartnerNavbar } from '../components/layout/PartnerNavbar';

// Leaflet Imports for coordinate selector map
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icons for Leaflet Map in Vite
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

type TabType = 'hotels' | 'vehicles' | 'reservations';

function MapEventsHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

function MapLocationSelector({ lat, lng, onChange }: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) {
  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative z-10">
      <MapContainer 
        center={[lat || 9.03, lng || 38.74]} 
        zoom={6} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lat && lng && (
          <Marker position={[lat, lng]} />
        )}
        <MapEventsHandler onChange={onChange} />
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[400] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-gray-700 shadow border border-gray-150">
        CLICK ON THE MAP TO SET COORDINATES
      </div>
    </div>
  );
}

export function PartnerDashboard() {
  const { data: session, isPending: sessionLoading } = useSession();
  const userRole = session?.user ? (session.user as any).role : null;

  // Workspace selection for admin
  const [activeWorkspace, setActiveWorkspace] = useState<'hotel' | 'car'>('hotel');

  // General States
  const [activeTab, setActiveTab] = useState<TabType>('hotels');
  const [hotels, setHotels] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States to trigger Modals
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState<any | null>(null);
  const [editVehicle, setEditVehicle] = useState<any | null>(null);

  // Hotel Form States
  const [hotelFormData, setHotelFormData] = useState<any>({
    name: '',
    description: '',
    location: '',
    rating: 4,
    pricePerNight: 100,
    image: '',
    galleryRaw: '',
    amenitiesRaw: '',
    lat: 9.03,
    lng: 38.74,
    checkIn: '2:00 PM',
    checkOut: '11:00 AM',
    cancellation: 'Free cancellation up to 24 hours before check-in',
    roomTypes: []
  });

  // Room type builder modal helper
  const [newRoom, setNewRoom] = useState({
    name: '',
    pricePerNight: 50,
    capacity: 2,
    image: ''
  });

  // Vehicle Form States
  const [vehicleFormData, setVehicleFormData] = useState<any>({
    name: '',
    type: 'SUV',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 80,
    image: '',
    galleryRaw: '',
    description: '',
    providerName: '',
    providerPhone: '',
    featuresRaw: '',
    policyMileage: 'Unlimited mileage included',
    policyFuel: 'Full to Full',
    policyCancellation: 'Free cancellation 24h prior'
  });

  useEffect(() => {
    if (userRole) {
      if (userRole === 'car') {
        setActiveWorkspace('car');
        setActiveTab('vehicles');
      } else {
        setActiveWorkspace('hotel');
        setActiveTab('hotels');
      }
    }
  }, [userRole]);

  const fetchData = async () => {
    if (!userRole) return;
    setLoading(true);
    try {
      const isHotelView = userRole === 'hotel' || (userRole === 'admin' && activeWorkspace === 'hotel');
      
      if (isHotelView) {
        const hotelsRes = await apiFetch(`${API_URL}/services/partner/hotels`);
        if (hotelsRes.ok) {
          const data = await hotelsRes.json();
          setHotels(Array.isArray(data) ? data : []);
        } else {
          setHotels([]);
        }
        
        const bookingsRes = await apiFetch(`${API_URL}/services/partner/bookings`);
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(Array.isArray(data) ? data : []);
        } else {
          setBookings([]);
        }
      } else {
        const vehiclesRes = await apiFetch(`${API_URL}/services/partner/vehicles`);
        if (vehiclesRes.ok) {
          const data = await vehiclesRes.json();
          setVehicles(Array.isArray(data) ? data : []);
        } else {
          setVehicles([]);
        }

        const bookingsRes = await apiFetch(`${API_URL}/services/partner/vehicle-bookings`);
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(Array.isArray(data) ? data : []);
        } else {
          setBookings([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setHotels([]);
      setVehicles([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userRole, activeWorkspace]);

  // HOTEL HANDLERS
  const openAddHotelModal = () => {
    setEditHotel(null);
    setHotelFormData({
      name: '',
      description: '',
      location: '',
      rating: 4,
      pricePerNight: 100,
      image: '',
      galleryRaw: '',
      amenitiesRaw: '',
      lat: 9.03,
      lng: 38.74,
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      roomTypes: []
    });
    setIsHotelModalOpen(true);
  };

  const openEditHotelModal = (hotel: any) => {
    setEditHotel(hotel);
    setHotelFormData({
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      rating: hotel.rating,
      pricePerNight: hotel.pricePerNight,
      image: hotel.image,
      galleryRaw: hotel.gallery ? hotel.gallery.join(', ') : '',
      amenitiesRaw: hotel.amenities ? hotel.amenities.join(', ') : '',
      lat: hotel.coordinates?.lat || 9.03,
      lng: hotel.coordinates?.lng || 38.74,
      checkIn: hotel.policies?.checkIn || '2:00 PM',
      checkOut: hotel.policies?.checkOut || '11:00 AM',
      cancellation: hotel.policies?.cancellation || 'Free cancellation up to 24 hours before check-in',
      roomTypes: hotel.roomTypes || []
    });
    setIsHotelModalOpen(true);
  };

  const handleHotelFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (lat: number, lng: number) => {
    setHotelFormData(prev => ({ ...prev, lat, lng }));
  };

  const addRoomType = () => {
    if (!newRoom.name) return;
    setHotelFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, newRoom]
    }));
    setNewRoom({ name: '', pricePerNight: 50, capacity: 2, image: '' });
  };

  const removeRoomType = (idx: number) => {
    setHotelFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== idx)
    }));
  };

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amenities = hotelFormData.amenitiesRaw.split(',').map(s => s.trim()).filter(Boolean);
    const gallery = hotelFormData.galleryRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name: hotelFormData.name,
      description: hotelFormData.description,
      location: hotelFormData.location,
      rating: Number(hotelFormData.rating),
      pricePerNight: Number(hotelFormData.pricePerNight),
      image: hotelFormData.image,
      gallery,
      amenities,
      coordinates: {
        lat: Number(hotelFormData.lat),
        lng: Number(hotelFormData.lng)
      },
      policies: {
        checkIn: hotelFormData.checkIn,
        checkOut: hotelFormData.checkOut,
        cancellation: hotelFormData.cancellation
      },
      roomTypes: hotelFormData.roomTypes
    };

    try {
      const url = editHotel 
        ? `${API_URL}/services/partner/hotels/${editHotel._id}` 
        : `${API_URL}/services/partner/hotels`;
      const method = editHotel ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsHotelModalOpen(false);
        fetchData();
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to save hotel property.");
      }
    } catch (err) {
      console.error("Error saving hotel:", err);
      alert("Failed to save hotel property.");
    }
  };

  const handleHotelDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const response = await apiFetch(`${API_URL}/services/partner/hotels/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      } else {
        alert("Failed to delete hotel.");
      }
    } catch (err) {
      console.error("Error deleting hotel:", err);
      alert("Failed to delete hotel.");
    }
  };

  // VEHICLE HANDLERS
  const openAddVehicleModal = () => {
    setEditVehicle(null);
    setVehicleFormData({
      name: '',
      type: 'SUV',
      transmission: 'Automatic',
      seats: 5,
      pricePerDay: 80,
      image: '',
      galleryRaw: '',
      description: '',
      providerName: session?.user.name || '',
      providerPhone: '',
      featuresRaw: 'A/C, Bluetooth, Backup Camera',
      policyMileage: 'Unlimited mileage included',
      policyFuel: 'Full to Full',
      policyCancellation: 'Free cancellation 24h prior'
    });
    setIsVehicleModalOpen(true);
  };

  const openEditVehicleModal = (vehicle: any) => {
    setEditVehicle(vehicle);
    setVehicleFormData({
      name: vehicle.name,
      type: vehicle.type || 'SUV',
      transmission: vehicle.transmission || 'Automatic',
      seats: vehicle.seats || 5,
      pricePerDay: vehicle.pricePerDay || 80,
      image: vehicle.image,
      galleryRaw: vehicle.gallery ? vehicle.gallery.join(', ') : '',
      description: vehicle.description || '',
      providerName: vehicle.provider?.name || '',
      providerPhone: vehicle.provider?.phone || '',
      featuresRaw: vehicle.features ? vehicle.features.join(', ') : '',
      policyMileage: vehicle.policies?.mileage || 'Unlimited mileage included',
      policyFuel: vehicle.policies?.fuel || 'Full to Full',
      policyCancellation: vehicle.policies?.cancellation || 'Free cancellation 24h prior'
    });
    setIsVehicleModalOpen(true);
  };

  const handleVehicleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = vehicleFormData.featuresRaw.split(',').map(s => s.trim()).filter(Boolean);
    const gallery = vehicleFormData.galleryRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name: vehicleFormData.name,
      type: vehicleFormData.type,
      transmission: vehicleFormData.transmission,
      seats: Number(vehicleFormData.seats),
      pricePerDay: Number(vehicleFormData.pricePerDay),
      image: vehicleFormData.image,
      gallery,
      description: vehicleFormData.description,
      provider: {
        name: vehicleFormData.providerName,
        rating: 5.0, // default rating
        phone: vehicleFormData.providerPhone
      },
      features,
      policies: {
        mileage: vehicleFormData.policyMileage,
        fuel: vehicleFormData.policyFuel,
        cancellation: vehicleFormData.policyCancellation
      },
      available: true
    };

    try {
      const url = editVehicle 
        ? `${API_URL}/services/partner/vehicles/${editVehicle._id}` 
        : `${API_URL}/services/partner/vehicles`;
      const method = editVehicle ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsVehicleModalOpen(false);
        fetchData();
      } else {
        const errData = await response.json();
        alert(errData.message || "Failed to save vehicle listing.");
      }
    } catch (err) {
      console.error("Error saving vehicle:", err);
      alert("Failed to save vehicle listing.");
    }
  };

  const handleVehicleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle from your fleet?")) return;
    try {
      const response = await apiFetch(`${API_URL}/services/partner/vehicles/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      } else {
        alert("Failed to delete vehicle.");
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Failed to delete vehicle.");
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'Confirmed' | 'Cancelled') => {
    if (!window.confirm(`Are you sure you want to mark this reservation as ${status}?`)) return;
    try {
      const response = await apiFetch(`${API_URL}/services/partner/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchData();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update status.");
    }
  };

  // Session loader spinner
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  // Guard redirection helper UI
  if (!userRole || !['hotel', 'car', 'agency', 'admin'].includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm text-center max-w-sm">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-500 text-sm mb-6">Your profile is not registered as an authorized partner account.</p>
          <a href="/" className="inline-flex px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm">Return Home</a>
        </div>
      </div>
    );
  }

  const isHotelView = userRole === 'hotel' || (userRole === 'admin' && activeWorkspace === 'hotel');

  // Stats calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const totalEarnings = bookings
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <PartnerNavbar />
      <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Workspace selector for admin accounts */}
        {userRole === 'admin' && (
          <div className="bg-white border border-gray-150 rounded-2xl p-4 mb-8 shadow-sm flex items-center justify-between">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Admin Workspace View</span>
            <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-150">
              <button
                onClick={() => {
                  setActiveWorkspace('hotel');
                  setActiveTab('hotels');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeWorkspace === 'hotel' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'
                }`}
              >
                <Building className="w-3.5 h-3.5" /> Hotel Manager
              </button>
              <button
                onClick={() => {
                  setActiveWorkspace('car');
                  setActiveTab('vehicles');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeWorkspace === 'car' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400'
                }`}
              >
                <Car className="w-3.5 h-3.5" /> Car Rental Manager
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
              {isHotelView ? (
                <>
                  <Building className="w-8 h-8 mr-3 text-green-700 animate-pulse" />
                  Hotel Property Manager
                </>
              ) : (
                <>
                  <Car className="w-8 h-8 mr-3 text-blue-700 animate-pulse" />
                  Car Rental Fleet Manager
                </>
              )}
            </h1>
            <p className="text-gray-500 mt-1">
              {isHotelView 
                ? 'Manage hotel room configurations, basic rates, and traveler guest list bookings.' 
                : 'Configure rental vehicles, prices, policies, and fleet booking operations.'}
            </p>
          </div>
          <div className="flex gap-4">
            {isHotelView ? (
              <button
                onClick={openAddHotelModal}
                className="flex items-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-green-600/10 text-sm"
              >
                <Plus className="w-5 h-5 mr-2" /> Register a Hotel
              </button>
            ) : (
              <button
                onClick={openAddVehicleModal}
                className="flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/10 text-sm"
              >
                <Plus className="w-5 h-5 mr-2" /> List a Vehicle
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Confirmed Earnings</span>
              <span className="text-2xl font-black text-gray-900">${totalEarnings}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-700 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Total Bookings</span>
              <span className="text-2xl font-black text-gray-900">{totalBookings}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Pending Bookings</span>
              <span className="text-2xl font-black text-gray-900">{pendingBookings}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-xl">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block">Confirmed Bookings</span>
              <span className="text-2xl font-black text-gray-900">{confirmedBookings}</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200 mb-8 gap-6">
          {isHotelView ? (
            <button
              onClick={() => setActiveTab('hotels')}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === 'hotels' ? 'text-green-700' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              My Hotels ({hotels.length})
              {activeTab === 'hotels' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === 'vehicles' ? 'text-blue-700' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              My Fleet ({vehicles.length})
              {activeTab === 'vehicles' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          )}
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'reservations' ? (isHotelView ? 'text-green-700' : 'text-blue-700') : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Reservations Manager ({bookings.length})
            {activeTab === 'reservations' && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isHotelView ? 'bg-green-600' : 'bg-blue-600'}`} />
            )}
          </button>
        </div>

        {/* LOADING SPINNER */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* HOTELS LIST TAB */}
            {activeTab === 'hotels' && (
              hotels.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                  <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No registered hotels found</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by registering your first property to receive traveler bookings.</p>
                  <button
                    onClick={openAddHotelModal}
                    className="inline-flex items-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Register Hotel
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {hotels.map(hotel => (
                    <div key={hotel._id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600'} 
                            alt={hotel.name}
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center shadow-sm">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current mr-1" /> {hotel.rating}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="text-xs text-gray-400 font-semibold mb-1 flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1" /> {hotel.location}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">{hotel.description}</p>
                          
                          <div className="flex gap-2 flex-wrap">
                            {hotel.amenities?.slice(0, 3).map((amenity: string, idx: number) => (
                              <span key={idx} className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-100">{amenity}</span>
                            ))}
                            {hotel.amenities?.length > 3 && (
                              <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded-full font-semibold border border-gray-100">+{hotel.amenities.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 pt-0 border-t border-gray-50 mt-4 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Price Nightly</span>
                          <span className="text-lg font-black text-green-700">${hotel.pricePerNight}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditHotelModal(hotel)}
                            className="p-3 bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors border border-gray-100"
                            title="Edit Hotel"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleHotelDelete(hotel._id)}
                            className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
                            title="Delete Hotel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* VEHICLES FLEET TAB */}
            {activeTab === 'vehicles' && (
              vehicles.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                  <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No registered vehicles found</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by listing your first car rental vehicle to receive bookings.</p>
                  <button
                    onClick={openAddVehicleModal}
                    className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" /> List Vehicle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {vehicles.map(vehicle => (
                    <div key={vehicle._id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={vehicle.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600'} 
                            alt={vehicle.name}
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-blue-700 flex items-center shadow-sm">
                            <Key className="w-3.5 h-3.5 mr-1" /> {vehicle.transmission}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="text-xs text-gray-400 font-semibold mb-1 flex items-center">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2 font-black">{vehicle.type}</span>
                            <span>{vehicle.seats} Seats</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">{vehicle.description}</p>
                          
                          <div className="flex gap-2 flex-wrap">
                            {vehicle.features?.slice(0, 3).map((feature: string, idx: number) => (
                              <span key={idx} className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-100">{feature}</span>
                            ))}
                            {vehicle.features?.length > 3 && (
                              <span className="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded-full font-semibold border border-gray-100">+{vehicle.features.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 pt-0 border-t border-gray-50 mt-4 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Price Daily</span>
                          <span className="text-lg font-black text-blue-700">${vehicle.pricePerDay}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditVehicleModal(vehicle)}
                            className="p-3 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors border border-gray-100"
                            title="Edit Vehicle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleVehicleDelete(vehicle._id)}
                            className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* RESERVATIONS MANAGER TAB */}
            {activeTab === 'reservations' && (
              bookings.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                  <ClipboardList className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No reservations received yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {isHotelView 
                      ? 'Reservations will automatically populate here when travelers book rooms at your hotels.' 
                      : 'Reservations will automatically populate here when travelers rent vehicles from your fleet.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <th className="py-4 px-6">{isHotelView ? 'Hotel / Room' : 'Vehicle'}</th>
                          <th className="py-4 px-6">Customer Details</th>
                          <th className="py-4 px-6">Dates</th>
                          <th className="py-4 px-6">{isHotelView ? 'Guests' : 'Days'}</th>
                          <th className="py-4 px-6">Total Price</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {bookings.map(booking => {
                          const checkIn = booking.startDate ? new Date(booking.startDate).toLocaleDateString() : '';
                          const checkOut = booking.endDate ? new Date(booking.endDate).toLocaleDateString() : '';
                          const itemName = isHotelView 
                            ? (hotels.find(h => h._id === booking.itemId)?.name || 'My Hotel')
                            : (vehicles.find(v => v._id === booking.itemId)?.name || 'My Vehicle');

                          return (
                            <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-5 px-6">
                                <div className="font-bold text-gray-900">{itemName}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{isHotelView ? (booking.roomType || 'Standard Room') : 'Car Rental'}</div>
                              </td>
                              <td className="py-5 px-6">
                                <div className="font-medium text-gray-900">{booking.customerName}</div>
                                <div className="text-xs text-gray-400">{booking.customerEmail}</div>
                                <div className="text-xs text-gray-400">{booking.phone}</div>
                              </td>
                              <td className="py-5 px-6">
                                <div className="font-semibold text-gray-800">{checkIn} - {checkOut}</div>
                              </td>
                              <td className="py-5 px-6 font-medium text-gray-600">
                                {isHotelView ? `${booking.guests || 1} Guest(s)` : `${booking.days || 1} Day(s)`}
                              </td>
                              <td className="py-5 px-6 font-extrabold text-green-700">
                                ${booking.totalPrice}
                              </td>
                              <td className="py-5 px-6">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                                  booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                                  booking.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                  'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                }`}>
                                  {booking.status || 'Pending'}
                                </span>
                              </td>
                              <td className="py-5 px-6 text-right">
                                {booking.status === 'Pending' ? (
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleUpdateBookingStatus(booking._id, 'Confirmed')}
                                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => handleUpdateBookingStatus(booking._id, 'Cancelled')}
                                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-colors border border-red-100"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400 font-medium">No actions</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </>
        )}

        {/* HOTEL REGISTER/EDIT MODAL */}
        {isHotelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-3xl border border-gray-100 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{editHotel ? 'Edit Hotel Listing' : 'Register a New Hotel'}</h3>
                <button onClick={() => setIsHotelModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleHotelSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={hotelFormData.name} 
                      onChange={handleHotelFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      placeholder="Grand Ethiopian Hotel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location/City</label>
                    <input 
                      type="text" 
                      name="location" 
                      required 
                      value={hotelFormData.location} 
                      onChange={handleHotelFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      placeholder="Addis Ababa, Ethiopia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={3}
                    value={hotelFormData.description} 
                    onChange={handleHotelFormChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                    placeholder="A brief description detailing the experiences and amenities..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Starting Price per Night ($)</label>
                    <input 
                      type="number" 
                      name="pricePerNight" 
                      required 
                      value={hotelFormData.pricePerNight} 
                      onChange={handleHotelFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel Rating (1-5)</label>
                    <input 
                      type="number" 
                      name="rating" 
                      min="1" 
                      max="5" 
                      step="0.1" 
                      required 
                      value={hotelFormData.rating} 
                      onChange={handleHotelFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Main Cover Image URL</label>
                    <input 
                      type="url" 
                      name="image" 
                      required 
                      value={hotelFormData.image} 
                      onChange={handleHotelFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities (comma-separated)</label>
                    <input 
                      type="text" 
                      name="amenitiesRaw" 
                      value={hotelFormData.amenitiesRaw} 
                      onChange={handleHotelFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      placeholder="Free Wi-Fi, Pool, Restaurant, Spa, Free Parking"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Image URLs (comma-separated)</label>
                    <input 
                      type="text" 
                      name="galleryRaw" 
                      value={hotelFormData.galleryRaw} 
                      onChange={handleHotelFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      placeholder="https://url1.com, https://url2.com"
                    />
                  </div>
                </div>

                {/* Map Coordinates Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hotel Location Coordinates: ({hotelFormData.lat.toFixed(5)}, {hotelFormData.lng.toFixed(5)})
                  </label>
                  <MapLocationSelector lat={hotelFormData.lat} lng={hotelFormData.lng} onChange={handleCoordinateChange} />
                </div>

                {/* Policies */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-green-700" /> Hotel Policies
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Check-In Time</label>
                      <input 
                        type="text" 
                        name="checkIn" 
                        value={hotelFormData.checkIn} 
                        onChange={handleHotelFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Check-Out Time</label>
                      <input 
                        type="text" 
                        name="checkOut" 
                        value={hotelFormData.checkOut} 
                        onChange={handleHotelFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cancellation Policy</label>
                    <input 
                      type="text" 
                      name="cancellation" 
                      value={hotelFormData.cancellation} 
                      onChange={handleHotelFormChange} 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                    />
                  </div>
                </div>

                {/* Room Types Builder */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-700" /> Room Configurations ({hotelFormData.roomTypes?.length || 0})
                  </h4>

                  {hotelFormData.roomTypes?.length > 0 && (
                    <div className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                      {hotelFormData.roomTypes.map((room: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-4">
                          <div className="flex items-center gap-4">
                            {room.image && (
                              <img src={room.image} alt={room.name} className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                            )}
                            <div>
                              <div className="font-bold text-gray-900">{room.name}</div>
                              <div className="text-xs text-gray-400">Up to {room.capacity} Guests &bull; ${room.pricePerNight}/night</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRoomType(idx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Room Name</label>
                        <input 
                          type="text" 
                          value={newRoom.name} 
                          onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Deluxe Suite"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Guests Capacity</label>
                        <input 
                          type="number" 
                          min="1"
                          value={newRoom.capacity} 
                          onChange={(e) => setNewRoom(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Nightly Price ($)</label>
                        <input 
                          type="number" 
                          min="0"
                          value={newRoom.pricePerNight} 
                          onChange={(e) => setNewRoom(prev => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Room Cover URL</label>
                        <input 
                          type="url" 
                          value={newRoom.image} 
                          onChange={(e) => setNewRoom(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addRoomType}
                      className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Room Option
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsHotelModalOpen(false)}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-green-600/10"
                  >
                    {editHotel ? 'Save Changes' : 'Register Hotel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VEHICLE REGISTER/EDIT MODAL */}
        {isVehicleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-3xl border border-gray-100 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{editVehicle ? 'Edit Vehicle Listing' : 'List a New Vehicle'}</h3>
                <button onClick={() => setIsVehicleModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleVehicleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Name / Model</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={vehicleFormData.name} 
                      onChange={handleVehicleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      placeholder="Toyota Land Cruiser"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Body Type</label>
                      <select 
                        name="type" 
                        value={vehicleFormData.type} 
                        onChange={handleVehicleFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Minivan">Minivan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                      <select 
                        name="transmission" 
                        value={vehicleFormData.transmission} 
                        onChange={handleVehicleFormChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Description</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={3}
                    value={vehicleFormData.description} 
                    onChange={handleVehicleFormChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    placeholder="Describe the condition, details, and features of the vehicle..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Rental Price ($)</label>
                    <input 
                      type="number" 
                      name="pricePerDay" 
                      required 
                      value={vehicleFormData.pricePerDay} 
                      onChange={handleVehicleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Seats Capacity</label>
                    <input 
                      type="number" 
                      name="seats" 
                      required 
                      value={vehicleFormData.seats} 
                      onChange={handleVehicleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image URL</label>
                    <input 
                      type="url" 
                      name="image" 
                      required 
                      value={vehicleFormData.image} 
                      onChange={handleVehicleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Features (comma-separated)</label>
                    <input 
                      type="text" 
                      name="featuresRaw" 
                      value={vehicleFormData.featuresRaw} 
                      onChange={handleVehicleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      placeholder="A/C, Bluetooth, Backup Camera, Leather Seats, 4WD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Image URLs (comma-separated)</label>
                    <input 
                      type="text" 
                      name="galleryRaw" 
                      value={vehicleFormData.galleryRaw} 
                      onChange={handleVehicleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      placeholder="https://img1.jpg, https://img2.jpg"
                    />
                  </div>
                </div>

                {/* Provider info */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-blue-700" /> Provider Profile (Publicly Visible)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Company / Owner Name</label>
                      <input 
                        type="text" 
                        name="providerName" 
                        required
                        value={vehicleFormData.providerName} 
                        onChange={handleVehicleFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Provider Contact Phone</label>
                      <input 
                        type="tel" 
                        name="providerPhone" 
                        required
                        value={vehicleFormData.providerPhone} 
                        onChange={handleVehicleFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                        placeholder="+251-9..."
                      />
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-700" /> Rental Policies
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mileage Policy</label>
                      <input 
                        type="text" 
                        name="policyMileage" 
                        value={vehicleFormData.policyMileage} 
                        onChange={handleVehicleFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fuel Guidelines</label>
                      <input 
                        type="text" 
                        name="policyFuel" 
                        value={vehicleFormData.policyFuel} 
                        onChange={handleVehicleFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cancellation Policy</label>
                      <input 
                        type="text" 
                        name="policyCancellation" 
                        value={vehicleFormData.policyCancellation} 
                        onChange={handleVehicleFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsVehicleModalOpen(false)}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-600/10"
                  >
                    {editVehicle ? 'Save Changes' : 'List Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
