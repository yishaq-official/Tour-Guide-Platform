import { useState, useEffect } from 'react';
import { Building, Plus, Trash2, Edit3, Loader2, Star, MapPin, Users, X, DollarSign, Calendar, Clock, ClipboardList, Info, Check, AlertTriangle } from 'lucide-react';
import { API_URL, apiFetch } from '../config';

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

type TabType = 'hotels' | 'reservations';

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
  const [activeTab, setActiveTab] = useState<TabType>('hotels');
  const [hotels, setHotels] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States to trigger Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({
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

  // Room type modal helpers
  const [newRoom, setNewRoom] = useState({
    name: '',
    pricePerNight: 50,
    capacity: 2,
    image: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const hotelsData = await apiFetch(`${API_URL}/services/partner/hotels`);
      setHotels(hotelsData);
      
      const bookingsData = await apiFetch(`${API_URL}/services/partner/bookings`);
      setBookings(bookingsData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditHotel(null);
    setFormData({
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
    setIsModalOpen(true);
  };

  const openEditModal = (hotel: any) => {
    setEditHotel(hotel);
    setFormData({
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
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
  };

  const addRoomType = () => {
    if (!newRoom.name) return;
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, newRoom]
    }));
    setNewRoom({ name: '', pricePerNight: 50, capacity: 2, image: '' });
  };

  const removeRoomType = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse commas
    const amenities = formData.amenitiesRaw.split(',').map(s => s.trim()).filter(Boolean);
    const gallery = formData.galleryRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      name: formData.name,
      description: formData.description,
      location: formData.location,
      rating: Number(formData.rating),
      pricePerNight: Number(formData.pricePerNight),
      image: formData.image,
      gallery,
      amenities,
      coordinates: {
        lat: Number(formData.lat),
        lng: Number(formData.lng)
      },
      policies: {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        cancellation: formData.cancellation
      },
      roomTypes: formData.roomTypes
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

      if (response) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Error saving hotel:", err);
      alert("Failed to save hotel.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await apiFetch(`${API_URL}/services/partner/hotels/${id}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (err) {
      console.error("Error deleting hotel:", err);
      alert("Failed to delete hotel.");
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'Confirmed' | 'Cancelled') => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${status}?`)) return;
    try {
      const response = await apiFetch(`${API_URL}/services/partner/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response) {
        fetchData();
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update status.");
    }
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const totalEarnings = bookings
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
              <Building className="w-8 h-8 mr-3 text-green-700" />
              Partner Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Manage your hotel listings, rooms, and guest reservations.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={openAddModal}
              className="flex items-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-green-600/10"
            >
              <Plus className="w-5 h-5 mr-2" /> Register a Hotel
            </button>
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
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'reservations' ? 'text-green-700' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Reservations Manager ({bookings.length})
            {activeTab === 'reservations' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          </div>
        ) : activeTab === 'hotels' ? (
          /* Hotels List View */
          hotels.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
              <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No registered hotels found</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by registering your first property to receive traveler bookings.</p>
              <button
                onClick={openAddModal}
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
                        onClick={() => openEditModal(hotel)}
                        className="p-3 bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors border border-gray-100"
                        title="Edit Hotel"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(hotel._id)}
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
        ) : (
          /* Reservations Manager Table */
          bookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
              <ClipboardList className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings received yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Reservations will automatically populate here when travelers book a room at your hotels.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Hotel / Room</th>
                      <th className="py-4 px-6">Guest Details</th>
                      <th className="py-4 px-6">Dates</th>
                      <th className="py-4 px-6">Guests</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {bookings.map(booking => {
                      const checkIn = booking.startDate ? new Date(booking.startDate).toLocaleDateString() : '';
                      const checkOut = booking.endDate ? new Date(booking.endDate).toLocaleDateString() : '';
                      const hotelName = hotels.find(h => h._id === booking.itemId)?.name || 'My Hotel';

                      return (
                        <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-5 px-6">
                            <div className="font-bold text-gray-900">{hotelName}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{booking.roomType || 'Standard Room'}</div>
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
                            {booking.guests} Guest(s)
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

        {/* Add/Edit Hotel Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-3xl border border-gray-100 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-8">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{editHotel ? 'Edit Hotel Listing' : 'Register a New Hotel'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleFormChange} 
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
                      value={formData.location} 
                      onChange={handleFormChange} 
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
                    value={formData.description} 
                    onChange={handleFormChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                    placeholder="A brief description detailing the experiences and amenities of the hotel..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Starting Price per Night ($)</label>
                    <input 
                      type="number" 
                      name="pricePerNight" 
                      required 
                      value={formData.pricePerNight} 
                      onChange={handleFormChange} 
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
                      value={formData.rating} 
                      onChange={handleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Main Cover Image URL</label>
                    <input 
                      type="url" 
                      name="image" 
                      required 
                      value={formData.image} 
                      onChange={handleFormChange} 
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
                      value={formData.amenitiesRaw} 
                      onChange={handleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      placeholder="Free Wi-Fi, Pool, Restaurant, Spa, Free Parking"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Image URLs (comma-separated)</label>
                    <input 
                      type="text" 
                      name="galleryRaw" 
                      value={formData.galleryRaw} 
                      onChange={handleFormChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      placeholder="https://url1.com, https://url2.com"
                    />
                  </div>
                </div>

                {/* Map Coordinates Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    Hotel Location Coordinates: ({formData.lat.toFixed(5)}, {formData.lng.toFixed(5)})
                  </label>
                  <MapLocationSelector lat={formData.lat} lng={formData.lng} onChange={handleCoordinateChange} />
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
                        value={formData.checkIn} 
                        onChange={handleFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Check-Out Time</label>
                      <input 
                        type="text" 
                        name="checkOut" 
                        value={formData.checkOut} 
                        onChange={handleFormChange} 
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cancellation Policy</label>
                    <input 
                      type="text" 
                      name="cancellation" 
                      value={formData.cancellation} 
                      onChange={handleFormChange} 
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500" 
                    />
                  </div>
                </div>

                {/* Room Types Builder */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-700" /> Available Room Types ({formData.roomTypes?.length || 0})
                  </h4>

                  {/* Registered Room Types List */}
                  {formData.roomTypes?.length > 0 && (
                    <div className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                      {formData.roomTypes.map((room: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-4">
                          <div className="flex items-center gap-4">
                            {room.image && (
                              <img src={room.image} alt={room.name} className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                            )}
                            <div>
                              <div className="font-bold text-gray-900">{room.name}</div>
                              <div className="text-xs text-gray-400">Up to {room.capacity} Guests &bull; ${room.pricePerNight} per night</div>
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

                  {/* Add Room Type Inputs */}
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
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Capacity (Guests)</label>
                        <input 
                          type="number" 
                          min="1"
                          value={newRoom.capacity} 
                          onChange={(e) => setNewRoom(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Price Nightly ($)</label>
                        <input 
                          type="number" 
                          min="0"
                          value={newRoom.pricePerNight} 
                          onChange={(e) => setNewRoom(prev => ({ ...prev, pricePerNight: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Room Image URL</label>
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

                {/* Modal Footer Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-green-600/10"
                  >
                    {editHotel ? 'Save Changes' : 'Register Hotel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
