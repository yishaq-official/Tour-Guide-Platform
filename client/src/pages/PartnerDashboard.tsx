import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building, Plus, Trash2, Edit3, Loader2, Star, MapPin, Users, X,
  DollarSign, Calendar, Clock, ClipboardList, Info, Check, AlertTriangle,
  Car, Key, Compass, Settings, ShieldCheck, CheckCircle2, Sparkles,
  ArrowRight, BadgeCheck, Layers
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

const panelClass =
  'rounded-[2rem] border border-white/10 bg-white/[0.92] shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl';
const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-offset-0';
const textAreaClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-offset-0';

const accentPresets = {
  emerald: {
    gradient: 'from-emerald-500/15 via-teal-500/10 to-cyan-500/0',
    ring: 'ring-emerald-500/30',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  sky: {
    gradient: 'from-sky-500/15 via-blue-500/10 to-indigo-500/0',
    ring: 'ring-sky-500/30',
    text: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    chip: 'bg-sky-50 text-sky-700 border-sky-100',
    button: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/20',
    dot: 'bg-sky-500',
  },
} as const;

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
    <div className="w-full h-72 rounded-[1.75rem] overflow-hidden border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.14)] relative z-10">
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
      <div className="absolute bottom-3 left-3 z-[400] rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.22em] text-slate-700 shadow-lg backdrop-blur-sm">
        CLICK TO PLACE COORDINATES
      </div>
    </div>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
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
  const accent = isHotelView ? accentPresets.emerald : accentPresets.sky;
  const workspaceTitle = isHotelView ? 'Hotel Property Manager' : 'Car Rental Fleet Manager';
  const workspaceSubtitle = isHotelView
    ? 'Curate polished stays, tune nightly pricing, and manage reservation flow from one elevated workspace.'
    : 'Shape a fleet showcase, refine rental rules, and keep every trip request moving smoothly.';
  const primaryCtaLabel = isHotelView ? 'Register a Hotel' : 'List a Vehicle';
  const secondaryCtaLabel = isHotelView ? 'Review Reservations' : 'Review Reservations';
  const activeInventoryCount = isHotelView ? hotels.length : vehicles.length;
  const activeInventoryLabel = isHotelView ? 'Listings live' : 'Vehicles live';
  const primaryTabLabel = isHotelView ? 'My Hotels' : 'My Fleet';
  const primaryTabCount = isHotelView ? hotels.length : vehicles.length;

  // Stats calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const totalEarnings = bookings
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const metrics = [
    {
      label: 'Confirmed earnings',
      value: formatMoney(totalEarnings),
      hint: 'Revenue locked by confirmed bookings',
      icon: DollarSign,
      chip: accent.bg,
      chipText: accent.text,
    },
    {
      label: 'Total bookings',
      value: String(totalBookings),
      hint: 'All incoming reservation requests',
      icon: ClipboardList,
      chip: 'bg-white',
      chipText: 'text-slate-700',
    },
    {
      label: 'Pending reviews',
      value: String(pendingBookings),
      hint: 'Needs partner action',
      icon: Clock,
      chip: 'bg-amber-50',
      chipText: 'text-amber-700',
    },
    {
      label: 'Confirmed stays',
      value: String(confirmedBookings),
      hint: 'Approved and scheduled',
      icon: CheckCircle2,
      chip: 'bg-emerald-50',
      chipText: 'text-emerald-700',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />
      <PartnerNavbar />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {userRole === 'admin' && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${panelClass} overflow-hidden`}
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Admin Workspace View</div>
                <div className="mt-2 text-sm text-slate-600">
                  Switch between hospitality and mobility with a single click.
                </div>
              </div>
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
                <button
                  onClick={() => {
                    setActiveWorkspace('hotel');
                    setActiveTab('hotels');
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                    activeWorkspace === 'hotel'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                  Hotel Manager
                </button>
                <button
                  onClick={() => {
                    setActiveWorkspace('car');
                    setActiveTab('vehicles');
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all ${
                    activeWorkspace === 'car'
                      ? 'bg-white text-sky-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Car className="h-3.5 w-3.5" />
                  Car Rental Manager
                </button>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`relative overflow-hidden ${panelClass}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient}`} />
          <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-slate-900/5 blur-3xl" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.9fr] lg:p-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${accent.chip}`}>
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Partner Command Center
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  <Compass className="h-3.5 w-3.5" />
                  {userRole}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  {workspaceTitle}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {workspaceSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={isHotelView ? openAddHotelModal : openAddVehicleModal}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 ${accent.button}`}
                >
                  <Plus className="h-4 w-4" />
                  {primaryCtaLabel}
                </button>
                <button
                  onClick={() => setActiveTab('reservations')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-white"
                >
                  {secondaryCtaLabel}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/70 bg-white/85 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">{activeInventoryLabel}</div>
                  <div className={`mt-2 text-3xl font-black ${accent.text}`}>{activeInventoryCount}</div>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/85 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Reservations</div>
                  <div className="mt-2 text-3xl font-black text-slate-900">{bookings.length}</div>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/85 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Fast actions</div>
                  <div className="mt-2 text-sm font-semibold text-slate-700">Update, confirm, and keep the queue moving</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-4">
                <div className="rounded-[1.75rem] border border-white/70 bg-slate-950 p-5 text-white shadow-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/55">Workspace Snapshot</div>
                      <div className="mt-2 text-2xl font-black">{activeTab === 'reservations' ? 'Reservation flow' : primaryTabLabel}</div>
                    </div>
                    <div className={`rounded-2xl px-3 py-2 text-xs font-black uppercase tracking-[0.2em] ${accent.bg} ${accent.text}`}>
                      Live
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white/8 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">Inventory</div>
                      <div className="mt-2 text-2xl font-black">{primaryTabCount}</div>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">Confirmed</div>
                      <div className="mt-2 text-2xl font-black">{confirmedBookings}</div>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">Pending</div>
                      <div className="mt-2 text-2xl font-black">{pendingBookings}</div>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-4">
                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">Earnings</div>
                      <div className="mt-2 text-2xl font-black">{formatMoney(totalEarnings)}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bg} ${accent.text}`}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">Refined partner experience</div>
                      <div className="text-sm text-slate-500">Clear actions, calmer hierarchy, and stronger visual rhythm.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${panelClass} p-5`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">{metric.label}</div>
                    <div className="mt-3 text-3xl font-black text-slate-950">{metric.value}</div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${metric.chip} ${metric.chipText}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-500">{metric.hint}</div>
              </motion.div>
            );
          })}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm">
              <button
                onClick={() => setActiveTab(isHotelView ? 'hotels' : 'vehicles')}
                className={`rounded-full px-4 py-2 text-sm font-black transition-all ${
                  activeTab === (isHotelView ? 'hotels' : 'vehicles')
                    ? `bg-slate-950 text-white`
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {primaryTabLabel} ({primaryTabCount})
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`rounded-full px-4 py-2 text-sm font-black transition-all ${
                  activeTab === 'reservations'
                    ? `bg-${isHotelView ? 'emerald' : 'sky'}-600 text-white`
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Reservations ({bookings.length})
              </button>
            </div>
            <div className="text-sm font-medium text-slate-500">
              {loading ? 'Refreshing partner data...' : 'Workspace ready'}
            </div>
          </div>

          {loading ? (
            <div className={`${panelClass} flex items-center justify-center py-24`}>
              <Loader2 className={`h-10 w-10 animate-spin ${accent.text}`} />
            </div>
          ) : (
            <>
              {activeTab === 'hotels' && (
                hotels.length === 0 ? (
                  <div className={`${panelClass} p-12 text-center`}>
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${accent.bg} ${accent.text}`}>
                      <Building className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">No registered hotels yet</h3>
                    <p className="mx-auto mt-3 max-w-md text-slate-500">
                      Build your first listing to start receiving bookings and showcase your hospitality brand.
                    </p>
                    <button
                      onClick={openAddHotelModal}
                      className={`mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg ${accent.button}`}
                    >
                      <Plus className="h-4 w-4" />
                      Register Hotel
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {hotels.map((hotel) => (
                      <motion.article
                        key={hotel._id}
                        whileHover={{ y: -6 }}
                        className={`${panelClass} overflow-hidden`}
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'}
                            alt={hotel.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent" />
                          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-lg backdrop-blur-sm">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
                            {hotel.rating}
                          </div>
                          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                            <MapPin className="h-3.5 w-3.5" />
                            {hotel.location}
                          </div>
                        </div>
                        <div className="space-y-4 p-6">
                          <div>
                            <h3 className="text-2xl font-black tracking-tight text-slate-950">{hotel.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">{hotel.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities?.slice(0, 3).map((amenity: string, idx: number) => (
                              <span
                                key={idx}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                              >
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities?.length > 3 && (
                              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-400">
                                +{hotel.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">Price Nightly</div>
                              <div className={`mt-1 text-2xl font-black ${accent.text}`}>${hotel.pricePerNight}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditHotelModal(hotel)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                title="Edit Hotel"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleHotelDelete(hotel._id)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                                title="Delete Hotel"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'vehicles' && (
                vehicles.length === 0 ? (
                  <div className={`${panelClass} p-12 text-center`}>
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${accent.bg} ${accent.text}`}>
                      <Car className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">No registered vehicles yet</h3>
                    <p className="mx-auto mt-3 max-w-md text-slate-500">
                      Add your first rental vehicle and turn your fleet into a premium booking catalog.
                    </p>
                    <button
                      onClick={openAddVehicleModal}
                      className={`mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg ${accent.button}`}
                    >
                      <Plus className="h-4 w-4" />
                      List Vehicle
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {vehicles.map((vehicle) => (
                      <motion.article
                        key={vehicle._id}
                        whileHover={{ y: -6 }}
                        className={`${panelClass} overflow-hidden`}
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={vehicle.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200'}
                            alt={vehicle.name}
                            className="h-full w-full object-cover transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent" />
                          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-sky-700 shadow-lg backdrop-blur-sm">
                            <Key className="h-3.5 w-3.5" />
                            {vehicle.transmission}
                          </div>
                          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {vehicle.type}
                            <span className="text-white/60">•</span>
                            {vehicle.seats} seats
                          </div>
                        </div>
                        <div className="space-y-4 p-6">
                          <div>
                            <h3 className="text-2xl font-black tracking-tight text-slate-950">{vehicle.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">{vehicle.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {vehicle.features?.slice(0, 3).map((feature: string, idx: number) => (
                              <span
                                key={idx}
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                              >
                                {feature}
                              </span>
                            ))}
                            {vehicle.features?.length > 3 && (
                              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-400">
                                +{vehicle.features.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">Price Daily</div>
                              <div className={`mt-1 text-2xl font-black ${accent.text}`}>${vehicle.pricePerDay}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditVehicleModal(vehicle)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                                title="Edit Vehicle"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleVehicleDelete(vehicle._id)}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                                title="Delete Vehicle"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'reservations' && (
                bookings.length === 0 ? (
                  <div className={`${panelClass} p-12 text-center`}>
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${accent.bg} ${accent.text}`}>
                      <ClipboardList className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">No reservations yet</h3>
                    <p className="mx-auto mt-3 max-w-md text-slate-500">
                      {isHotelView
                        ? 'Reservations will appear here when travelers book rooms at your properties.'
                        : 'Reservations will appear here when travelers rent vehicles from your fleet.'}
                    </p>
                  </div>
                ) : (
                  <div className={`${panelClass} overflow-hidden`}>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                            <th className="px-6 py-4">{isHotelView ? 'Hotel / Room' : 'Vehicle'}</th>
                            <th className="px-6 py-4">Customer Details</th>
                            <th className="px-6 py-4">Dates</th>
                            <th className="px-6 py-4">{isHotelView ? 'Guests' : 'Days'}</th>
                            <th className="px-6 py-4">Total Price</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {bookings.map((booking) => {
                            const checkIn = booking.startDate ? new Date(booking.startDate).toLocaleDateString() : '';
                            const checkOut = booking.endDate ? new Date(booking.endDate).toLocaleDateString() : '';
                            const itemName = isHotelView
                              ? (hotels.find((h) => h._id === booking.itemId)?.name || 'My Hotel')
                              : (vehicles.find((v) => v._id === booking.itemId)?.name || 'My Vehicle');

                            const statusClasses =
                              booking.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : booking.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200';

                            return (
                              <tr key={booking._id} className="transition hover:bg-slate-50/70">
                                <td className="px-6 py-5">
                                  <div className="font-bold text-slate-950">{itemName}</div>
                                  <div className="mt-0.5 text-xs text-slate-400">
                                    {isHotelView ? (booking.roomType || 'Standard Room') : 'Car Rental'}
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="font-medium text-slate-900">{booking.customerName}</div>
                                  <div className="text-xs text-slate-400">{booking.customerEmail}</div>
                                  <div className="text-xs text-slate-400">{booking.phone}</div>
                                </td>
                                <td className="px-6 py-5 font-semibold text-slate-700">{checkIn} - {checkOut}</td>
                                <td className="px-6 py-5 font-medium text-slate-600">
                                  {isHotelView ? `${booking.guests || 1} Guest(s)` : `${booking.days || 1} Day(s)`}
                                </td>
                                <td className="px-6 py-5 font-black text-emerald-700">{formatMoney(booking.totalPrice)}</td>
                                <td className="px-6 py-5">
                                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses}`}>
                                    {booking.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                  {booking.status === 'Pending' ? (
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => handleUpdateBookingStatus(booking._id, 'Confirmed')}
                                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => handleUpdateBookingStatus(booking._id, 'Cancelled')}
                                        className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-100"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-medium text-slate-400">No actions</span>
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
        </section>

        <AnimatePresence>
          {isHotelModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-md"
            >
              <div className="mx-auto my-8 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-500">Hotel Listing</div>
                    <h3 className="mt-1 text-2xl font-black text-slate-950">
                      {editHotel ? 'Edit Hotel Listing' : 'Register a New Hotel'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsHotelModalOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleHotelSubmit} className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Hotel Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={hotelFormData.name}
                        onChange={handleHotelFormChange}
                        className={inputClass}
                        placeholder="Grand Ethiopian Hotel"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Location / City</label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={hotelFormData.location}
                        onChange={handleHotelFormChange}
                        className={inputClass}
                        placeholder="Addis Ababa, Ethiopia"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-bold text-slate-700">Description</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      value={hotelFormData.description}
                      onChange={handleHotelFormChange}
                      className={textAreaClass}
                      placeholder="A brief description detailing the experiences and amenities..."
                    />
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Starting Price per Night ($)</label>
                      <input type="number" name="pricePerNight" required value={hotelFormData.pricePerNight} onChange={handleHotelFormChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Hotel Rating (1-5)</label>
                      <input type="number" name="rating" min="1" max="5" step="0.1" required value={hotelFormData.rating} onChange={handleHotelFormChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Main Cover Image URL</label>
                      <input type="url" name="image" required value={hotelFormData.image} onChange={handleHotelFormChange} className={inputClass} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Amenities (comma-separated)</label>
                      <input type="text" name="amenitiesRaw" value={hotelFormData.amenitiesRaw} onChange={handleHotelFormChange} className={inputClass} placeholder="Free Wi-Fi, Pool, Restaurant, Spa, Free Parking" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Gallery Image URLs (comma-separated)</label>
                      <input type="text" name="galleryRaw" value={hotelFormData.galleryRaw} onChange={handleHotelFormChange} className={inputClass} placeholder="https://url1.com, https://url2.com" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Hotel Location Coordinates: ({hotelFormData.lat.toFixed(5)}, {hotelFormData.lng.toFixed(5)})
                    </label>
                    <MapLocationSelector lat={hotelFormData.lat} lng={hotelFormData.lng} onChange={handleCoordinateChange} />
                  </div>

                  <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-700">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      Hotel Policies
                    </h4>
                    <div className="mt-5 grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Check-In Time</label>
                        <input type="text" name="checkIn" value={hotelFormData.checkIn} onChange={handleHotelFormChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Check-Out Time</label>
                        <input type="text" name="checkOut" value={hotelFormData.checkOut} onChange={handleHotelFormChange} className={inputClass} />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Cancellation Policy</label>
                      <input type="text" name="cancellation" value={hotelFormData.cancellation} onChange={handleHotelFormChange} className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-700">
                      <Users className="h-4 w-4 text-emerald-600" />
                      Room Configurations ({hotelFormData.roomTypes?.length || 0})
                    </h4>

                    {hotelFormData.roomTypes?.length > 0 && (
                      <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        {hotelFormData.roomTypes.map((room: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between gap-4 p-4">
                            <div className="flex items-center gap-4">
                              {room.image && (
                                <img src={room.image} alt={room.name} className="h-12 w-12 rounded-xl object-cover" />
                              )}
                              <div>
                                <div className="font-bold text-slate-950">{room.name}</div>
                                <div className="text-xs text-slate-400">Up to {room.capacity} guests • ${room.pricePerNight}/night</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeRoomType(idx)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="grid gap-4 lg:grid-cols-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Room Name</label>
                          <input type="text" value={newRoom.name} onChange={(e) => setNewRoom((prev) => ({ ...prev, name: e.target.value }))} placeholder="Deluxe Suite" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Guests Capacity</label>
                          <input type="number" min="1" value={newRoom.capacity} onChange={(e) => setNewRoom((prev) => ({ ...prev, capacity: Number(e.target.value) }))} className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Nightly Price ($)</label>
                          <input type="number" min="0" value={newRoom.pricePerNight} onChange={(e) => setNewRoom((prev) => ({ ...prev, pricePerNight: Number(e.target.value) }))} className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Room Cover URL</label>
                          <input type="url" value={newRoom.image} onChange={(e) => setNewRoom((prev) => ({ ...prev, image: e.target.value }))} placeholder="https://..." className={inputClass} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addRoomType}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Room Option
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsHotelModalOpen(false)}
                      className="rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`rounded-full px-6 py-3 text-sm font-black text-white shadow-lg ${accent.button}`}
                    >
                      {editHotel ? 'Save Changes' : 'Register Hotel'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {isVehicleModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-md"
            >
              <div className="mx-auto my-8 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-500">Vehicle Listing</div>
                    <h3 className="mt-1 text-2xl font-black text-slate-950">
                      {editVehicle ? 'Edit Vehicle Listing' : 'List a New Vehicle'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsVehicleModalOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleVehicleSubmit} className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Vehicle Name / Model</label>
                      <input type="text" name="name" required value={vehicleFormData.name} onChange={handleVehicleFormChange} className={inputClass} placeholder="Toyota Land Cruiser" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Body Type</label>
                        <select name="type" value={vehicleFormData.type} onChange={handleVehicleFormChange} className={inputClass}>
                          <option value="SUV">SUV</option>
                          <option value="Sedan">Sedan</option>
                          <option value="Minivan">Minivan</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Transmission</label>
                        <select name="transmission" value={vehicleFormData.transmission} onChange={handleVehicleFormChange} className={inputClass}>
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-bold text-slate-700">Vehicle Description</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      value={vehicleFormData.description}
                      onChange={handleVehicleFormChange}
                      className={textAreaClass}
                      placeholder="Describe the condition, details, and features of the vehicle..."
                    />
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Daily Rental Price ($)</label>
                      <input type="number" name="pricePerDay" required value={vehicleFormData.pricePerDay} onChange={handleVehicleFormChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Seats Capacity</label>
                      <input type="number" name="seats" required value={vehicleFormData.seats} onChange={handleVehicleFormChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Cover Image URL</label>
                      <input type="url" name="image" required value={vehicleFormData.image} onChange={handleVehicleFormChange} className={inputClass} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Features (comma-separated)</label>
                      <input type="text" name="featuresRaw" value={vehicleFormData.featuresRaw} onChange={handleVehicleFormChange} className={inputClass} placeholder="A/C, Bluetooth, Backup Camera, Leather Seats, 4WD" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Gallery Image URLs (comma-separated)</label>
                      <input type="text" name="galleryRaw" value={vehicleFormData.galleryRaw} onChange={handleVehicleFormChange} className={inputClass} placeholder="https://img1.jpg, https://img2.jpg" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-700">
                      <ShieldCheck className="h-4 w-4 text-sky-600" />
                      Provider Profile
                    </h4>
                    <div className="mt-5 grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Company / Owner Name</label>
                        <input type="text" name="providerName" required value={vehicleFormData.providerName} onChange={handleVehicleFormChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Provider Contact Phone</label>
                        <input type="tel" name="providerPhone" required value={vehicleFormData.providerPhone} onChange={handleVehicleFormChange} className={inputClass} placeholder="+251-9..." />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-700">
                      <Clock className="h-4 w-4 text-sky-600" />
                      Rental Policies
                    </h4>
                    <div className="mt-5 grid gap-6 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Mileage Policy</label>
                        <input type="text" name="policyMileage" value={vehicleFormData.policyMileage} onChange={handleVehicleFormChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Fuel Guidelines</label>
                        <input type="text" name="policyFuel" value={vehicleFormData.policyFuel} onChange={handleVehicleFormChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Cancellation Policy</label>
                        <input type="text" name="policyCancellation" value={vehicleFormData.policyCancellation} onChange={handleVehicleFormChange} className={inputClass} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsVehicleModalOpen(false)}
                      className="rounded-full border border-slate-200 px-6 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-sky-700"
                    >
                      {editVehicle ? 'Save Changes' : 'List Vehicle'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
