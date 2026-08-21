import { useState, useEffect } from 'react';
import { Landmark, Compass, Hotel, Car, Plus, LogOut, ArrowLeft, Trash2, Edit3, Loader2, Star, MapPin, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
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

type TabType = 'heritages' | 'cultures' | 'hotels' | 'vehicles';

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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('heritages');
  const [heritages, setHeritages] = useState<any[]>([]);
  const [cultures, setCultures] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States to trigger Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<{ type: TabType; data: any } | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [heritagesRes, culturesRes, hotelsRes, vehiclesRes] = await Promise.all([
        apiFetch(`${API_URL}/heritages`),
        apiFetch(`${API_URL}/cultures`),
        apiFetch(`${API_URL}/services/hotels`),
        apiFetch(`${API_URL}/services/vehicles`)
      ]);

      if (heritagesRes.ok) setHeritages(await heritagesRes.json());
      if (culturesRes.ok) setCultures(await culturesRes.json());
      if (hotelsRes.ok) setHotels(await hotelsRes.json());
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDelete = async (type: TabType, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;

    try {
      let endpoint = '';
      if (type === 'heritages') endpoint = `${API_URL}/heritages/${id}`;
      else if (type === 'cultures') endpoint = `${API_URL}/cultures/${id}`;
      else if (type === 'hotels') endpoint = `${API_URL}/services/hotels/${id}`;
      else if (type === 'vehicles') endpoint = `${API_URL}/services/vehicles/${id}`;

      const res = await apiFetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        if (type === 'heritages') setHeritages(prev => prev.filter(item => item._id !== id));
        else if (type === 'cultures') setCultures(prev => prev.filter(item => item._id !== id));
        else if (type === 'hotels') setHotels(prev => prev.filter(item => item._id !== id));
        else if (type === 'vehicles') setVehicles(prev => prev.filter(item => item._id !== id));
      } else {
        alert("Failed to delete item. Please ensure you have administrator privileges.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while deleting item.");
    }
  };

  const openAddModal = () => {
    let initial = {};
    if (activeTab === 'heritages') {
      initial = {
        name: '', description: '', history: '', location: '', category: 'Historical', isUnesco: false,
        coordinates: { lat: 9.03, lng: 38.74 }, region: '', image: '',
        quickFacts: { established: '', type: '' }, touristHighlights: [], travelerExperience: []
      };
    } else if (activeTab === 'cultures') {
      initial = {
        name: '', history: '', location: '', isUnesco: true, image: '',
        quickFacts: { established: '', type: '' }, culturalHighlights: [], travelerExperience: []
      };
    } else if (activeTab === 'hotels') {
      initial = {
        name: '', description: '', location: '', rating: 5, pricePerNight: 100, image: '',
        amenities: '', coordinates: { lat: 9.03, lng: 38.74 },
        policies: { checkIn: '14:00', checkOut: '12:00', cancellation: 'Free cancellation up to 24h' },
        roomTypes: []
      };
    } else if (activeTab === 'vehicles') {
      initial = {
        name: '', type: 'SUV', transmission: 'Automatic', seats: 5, pricePerDay: 50, image: '', description: '',
        provider: { name: '', rating: 5, phone: '' }, features: '',
        policies: { mileage: 'Unlimited', fuel: 'Full to Full', cancellation: 'Free cancellation' }
      };
    }
    setFormData(initial);
    setEditItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    let itemData = { ...item };
    if (activeTab === 'hotels') {
      itemData.amenities = Array.isArray(item.amenities) ? item.amenities.join(', ') : item.amenities;
    } else if (activeTab === 'vehicles') {
      itemData.features = Array.isArray(item.features) ? item.features.join(', ') : item.features;
    }
    setFormData(itemData);
    setEditItem({ type: activeTab, data: item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let payload = { ...formData };
    if (activeTab === 'hotels' && typeof payload.amenities === 'string') {
      payload.amenities = payload.amenities.split(',').map((x: string) => x.trim()).filter(Boolean);
    } else if (activeTab === 'vehicles' && typeof payload.features === 'string') {
      payload.features = payload.features.split(',').map((x: string) => x.trim()).filter(Boolean);
    }

    const isEditing = !!editItem;
    const method = isEditing ? 'PUT' : 'POST';
    let url = '';
    if (activeTab === 'heritages') url = `${API_URL}/heritages${isEditing ? `/${editItem.data._id}` : ''}`;
    else if (activeTab === 'cultures') url = `${API_URL}/cultures${isEditing ? `/${editItem.data._id}` : ''}`;
    else if (activeTab === 'hotels') url = `${API_URL}/services/hotels${isEditing ? `/${editItem.data._id}` : ''}`;
    else if (activeTab === 'vehicles') url = `${API_URL}/services/vehicles${isEditing ? `/${editItem.data._id}` : ''}`;

    try {
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(`Successfully ${isEditing ? 'updated' : 'added'} item!`);
        setIsModalOpen(false);
        setEditItem(null);
        fetchAllData();
      } else {
        const errData = await res.json();
        alert(`Error saving item: ${errData.message || 'Server error'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred while saving.");
    }
  };

  const tabs = [
    { id: 'heritages' as TabType, label: 'Heritages', icon: Landmark },
    { id: 'cultures' as TabType, label: 'Cultures', icon: Compass },
    { id: 'hotels' as TabType, label: 'Hotels', icon: Hotel },
    { id: 'vehicles' as TabType, label: 'Vehicles', icon: Car },
  ];

  const getActiveList = () => {
    switch (activeTab) {
      case 'heritages': return heritages;
      case 'cultures': return cultures;
      case 'hotels': return hotels;
      case 'vehicles': return vehicles;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-950 flex items-center gap-2">
                TravelAssist <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 font-extrabold border border-green-200">ADMIN</span>
              </h1>
              <p className="text-xs text-gray-500">Manage catalog and items dynamically</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Quick Statistics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Heritages', value: heritages.length, icon: Landmark, bg: 'bg-amber-500/10 text-amber-700' },
            { label: 'Total Cultures', value: cultures.length, icon: Compass, bg: 'bg-purple-500/10 text-purple-700' },
            { label: 'Registered Hotels', value: hotels.length, icon: Hotel, bg: 'bg-emerald-500/10 text-emerald-700' },
            { label: 'Registered Vehicles', value: vehicles.length, icon: Car, bg: 'bg-blue-500/10 text-blue-700' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-gray-500">{stat.label}</span>
                <div className="text-3xl font-black text-gray-900 mt-1">{stat.value}</div>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </section>

        {/* Catalog Control Area */}
        <section className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          
          {/* Tabs and Actions Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-gray-150/60 p-1.5 rounded-2xl gap-1.5 self-start">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-white text-gray-950 shadow-md' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-green-600/10 text-sm"
            >
              <Plus className="w-4 h-4" /> Add New {activeTab.slice(0, -1)}
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Loading catalog items</h3>
                <p className="text-sm text-gray-500">Fetching records from server...</p>
              </div>
            ) : getActiveList().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Landmark className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No items registered</h3>
                <p className="text-sm text-gray-500 max-w-sm">Get started by clicking the "Add New" button above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-black text-gray-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Image</th>
                      <th className="py-4 px-6">Details</th>
                      <th className="py-4 px-6">Attributes</th>
                      <th className="py-4 px-6">Pricing / Meta</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {getActiveList().map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Image */}
                        <td className="py-4 px-6">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm shrink-0" 
                          />
                        </td>
                        
                        {/* Details */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-gray-900 text-base">{item.name}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {item.location || 'N/A'}
                          </div>
                        </td>
                        
                        {/* Attributes */}
                        <td className="py-4 px-6">
                          {activeTab === 'heritages' && (
                            <div className="space-y-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">{item.category}</span>
                              {item.isUnesco && (
                                <div className="text-xs text-amber-600 font-extrabold flex items-center mt-0.5">★ UNESCO Heritage</div>
                              )}
                            </div>
                          )}
                          {activeTab === 'cultures' && (
                            <div className="space-y-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">Cultural</span>
                            </div>
                          )}
                          {activeTab === 'hotels' && (
                            <div className="space-y-1">
                              <div className="flex items-center text-amber-500 text-xs font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" /> {item.rating} Stars
                              </div>
                              <span className="text-xs text-gray-500 block">{(item.roomTypes?.length || 0)} Room Types</span>
                            </div>
                          )}
                          {activeTab === 'vehicles' && (
                            <div className="space-y-1">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">{item.type} ({item.transmission})</span>
                              <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                <Users className="w-3.5 h-3.5 mr-1" /> {item.seats} Seats
                              </div>
                            </div>
                          )}
                        </td>
                        
                        {/* Pricing / Meta */}
                        <td className="py-4 px-6 font-semibold">
                          {activeTab === 'hotels' && (
                            <div>
                              <span className="text-xs text-gray-400 block font-normal">Starting Price</span>
                              <span className="text-green-700">${item.pricePerNight} <span className="text-xs text-gray-500 font-normal">/ night</span></span>
                            </div>
                          )}
                          {activeTab === 'vehicles' && (
                            <div>
                              <span className="text-xs text-gray-400 block font-normal">Daily Fee</span>
                              <span className="text-green-700">${item.pricePerDay} <span className="text-xs text-gray-500 font-normal">/ day</span></span>
                            </div>
                          )}
                          {(activeTab === 'heritages' || activeTab === 'cultures') && (
                            <span className="text-gray-500 text-xs">Free / Open Catalog</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(item)}
                              className="p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(activeTab, item._id)}
                              className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Unified Add/Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-2xl font-bold text-gray-900">
                {editItem ? 'Edit' : 'Add New'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* General Fields */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Name / Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name || ''} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Location (Region/City)</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.location || ''} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Primary Image URL</label>
                  <input 
                    type="url" 
                    required 
                    value={formData.image || ''} 
                    onChange={e => setFormData({ ...formData, image: e.target.value })} 
                    placeholder="https://..." 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                  />
                </div>

                {/* HERITAGE SPECIFIC FIELDS */}
                {activeTab === 'heritages' && (
                  <>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                      <select 
                        value={formData.category || 'Historical'} 
                        onChange={e => setFormData({ ...formData, category: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold bg-white"
                      >
                        <option value="Historical">Historical</option>
                        <option value="Natural">Natural</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Archaeological">Archaeological</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Region</label>
                      <input 
                        type="text" 
                        value={formData.region || ''} 
                        onChange={e => setFormData({ ...formData, region: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        rows={3} 
                        value={formData.description || ''} 
                        onChange={e => setFormData({ ...formData, description: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">History & Background</label>
                      <textarea 
                        rows={3} 
                        value={formData.history || ''} 
                        onChange={e => setFormData({ ...formData, history: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Quick Facts - Established</label>
                      <input 
                        type="text" 
                        value={formData.quickFacts?.established || ''} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          quickFacts: { ...formData.quickFacts, established: e.target.value } 
                        })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Quick Facts - Type</label>
                      <input 
                        type="text" 
                        value={formData.quickFacts?.type || ''} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          quickFacts: { ...formData.quickFacts, type: e.target.value } 
                        })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isUnesco"
                        checked={formData.isUnesco || false} 
                        onChange={e => setFormData({ ...formData, isUnesco: e.target.checked })} 
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                      />
                      <label htmlFor="isUnesco" className="text-sm font-bold text-gray-700 cursor-pointer">Official UNESCO Heritage Site</label>
                    </div>
                  </>
                )}

                {/* CULTURE SPECIFIC FIELDS */}
                {activeTab === 'cultures' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">History & Significance</label>
                      <textarea 
                        rows={3} 
                        required
                        value={formData.history || ''} 
                        onChange={e => setFormData({ ...formData, history: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Quick Facts - Origin Period</label>
                      <input 
                        type="text" 
                        value={formData.quickFacts?.established || ''} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          quickFacts: { ...formData.quickFacts, established: e.target.value } 
                        })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Quick Facts - Main Type</label>
                      <input 
                        type="text" 
                        value={formData.quickFacts?.type || ''} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          quickFacts: { ...formData.quickFacts, type: e.target.value } 
                        })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isUnescoCulture"
                        checked={formData.isUnesco || false} 
                        onChange={e => setFormData({ ...formData, isUnesco: e.target.checked })} 
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
                      />
                      <label htmlFor="isUnescoCulture" className="text-sm font-bold text-gray-700 cursor-pointer">Official UNESCO Cultural heritage</label>
                    </div>
                  </>
                )}

                {/* HOTEL SPECIFIC FIELDS */}
                {activeTab === 'hotels' && (
                  <>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Rating (Stars)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="5"
                        required
                        value={formData.rating || 5} 
                        onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Starting Price per Night ($)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.pricePerNight || 100} 
                        onChange={e => setFormData({ ...formData, pricePerNight: parseInt(e.target.value) })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        rows={3} 
                        required
                        value={formData.description || ''} 
                        onChange={e => setFormData({ ...formData, description: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Amenities (Comma separated list)</label>
                      <input 
                        type="text" 
                        placeholder="Free WiFi, Pool, Restaurant, Spa, Parking"
                        value={formData.amenities || ''} 
                        onChange={e => setFormData({ ...formData, amenities: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Check-in Policy</label>
                      <input 
                        type="text" 
                        value={formData.policies?.checkIn || '14:00'} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          policies: { ...formData.policies, checkIn: e.target.value } 
                        })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Check-out Policy</label>
                      <input 
                        type="text" 
                        value={formData.policies?.checkOut || '12:00'} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          policies: { ...formData.policies, checkOut: e.target.value } 
                        })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Cancellation Policy</label>
                      <input 
                        type="text" 
                        value={formData.policies?.cancellation || 'Free cancellation'} 
                        onChange={e => setFormData({ 
                          ...formData, 
                          policies: { ...formData.policies, cancellation: e.target.value } 
                        })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>
                  </>
                )}

                {/* VEHICLE SPECIFIC FIELDS */}
                {activeTab === 'vehicles' && (
                  <>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Transmission</label>
                      <select 
                        value={formData.transmission || 'Automatic'} 
                        onChange={e => setFormData({ ...formData, transmission: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold bg-white"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                      <select 
                        value={formData.type || 'SUV'} 
                        onChange={e => setFormData({ ...formData, type: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold bg-white"
                      >
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Minivan">Minivan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Seats</label>
                      <input 
                        type="number" 
                        required
                        value={formData.seats || 5} 
                        onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Daily Price ($)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.pricePerDay || 50} 
                        onChange={e => setFormData({ ...formData, pricePerDay: parseInt(e.target.value) })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                      <textarea 
                        rows={2} 
                        value={formData.description || ''} 
                        onChange={e => setFormData({ ...formData, description: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold resize-none" 
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Features (Comma separated list)</label>
                      <input 
                        type="text" 
                        placeholder="Air Conditioning, Bluetooth, GPS Navigation, 4WD"
                        value={formData.features || ''} 
                        onChange={e => setFormData({ ...formData, features: e.target.value })} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold" 
                      />
                    </div>

                    {/* Provider */}
                    <div className="md:col-span-2 border-t border-gray-100 pt-4">
                      <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-3">Vehicle Provider Details</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Provider Name</label>
                          <input 
                            type="text" 
                            required
                            value={formData.provider?.name || ''} 
                            onChange={e => setFormData({ 
                              ...formData, 
                              provider: { ...formData.provider, name: e.target.value } 
                            })} 
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Provider Rating</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="5"
                            required
                            value={formData.provider?.rating || 5} 
                            onChange={e => setFormData({ 
                              ...formData, 
                              provider: { ...formData.provider, rating: parseFloat(e.target.value) } 
                            })} 
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Provider Phone</label>
                          <input 
                            type="text" 
                            required
                            value={formData.provider?.phone || ''} 
                            onChange={e => setFormData({ 
                              ...formData, 
                              provider: { ...formData.provider, phone: e.target.value } 
                            })} 
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* COORDINATES SELECTOR MAP FOR HERITAGE / HOTELS */}
                {(activeTab === 'heritages' || activeTab === 'hotels') && (
                  <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Location Coordinates</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Latitude</span>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={formData.coordinates?.lat || ''} 
                          onChange={e => setFormData({
                            ...formData,
                            coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) }
                          })} 
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Longitude</span>
                        <input 
                          type="number" 
                          step="any"
                          required
                          value={formData.coordinates?.lng || ''} 
                          onChange={e => setFormData({
                            ...formData,
                            coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) }
                          })} 
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                        />
                      </div>
                    </div>
                    <MapLocationSelector 
                      lat={formData.coordinates?.lat} 
                      lng={formData.coordinates?.lng} 
                      onChange={(lat, lng) => setFormData({
                        ...formData,
                        coordinates: { lat, lng }
                      })} 
                    />
                  </div>
                )}

                {/* DYNAMIC SUB-ARRAYS MANAGER */}
                {(activeTab === 'heritages' || activeTab === 'cultures') && (
                  <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Highlights Panel</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          const arrKey = activeTab === 'heritages' ? 'touristHighlights' : 'culturalHighlights';
                          const list = formData[arrKey] || [];
                          setFormData({ ...formData, [arrKey]: [...list, { title: '', description: '' }] });
                        }}
                        className="text-xs text-green-600 font-bold flex items-center gap-1 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200/50"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Highlight
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {((activeTab === 'heritages' ? formData.touristHighlights : formData.culturalHighlights) || []).map((hl: any, idx: number) => {
                        const arrKey = activeTab === 'heritages' ? 'touristHighlights' : 'culturalHighlights';
                        return (
                          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-2">
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...formData[arrKey]];
                                list.splice(idx, 1);
                                setFormData({ ...formData, [arrKey]: list });
                              }}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xs"
                            >
                              Remove
                            </button>
                            <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Highlight Title</label>
                              <input 
                                type="text" 
                                placeholder="E.g., Obelisk of Axum" 
                                required
                                value={hl.title || ''}
                                onChange={e => {
                                  const list = [...formData[arrKey]];
                                  list[idx].title = e.target.value;
                                  setFormData({ ...formData, [arrKey]: list });
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Description</label>
                              <textarea 
                                placeholder="Brief detail..." 
                                rows={2}
                                required
                                value={hl.description || ''}
                                onChange={e => {
                                  const list = [...formData[arrKey]];
                                  list[idx].description = e.target.value;
                                  setFormData({ ...formData, [arrKey]: list });
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none resize-none"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ROOM TYPES MANAGER FOR HOTELS */}
                {activeTab === 'hotels' && (
                  <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider font-bold">Room Types Management</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          const list = formData.roomTypes || [];
                          setFormData({ ...formData, roomTypes: [...list, { name: '', pricePerNight: 50, capacity: 2, image: '' }] });
                        }}
                        className="text-xs text-green-600 font-bold flex items-center gap-1 hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200/50"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Room Type
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(formData.roomTypes || []).map((room: any, idx: number) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 relative space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...formData.roomTypes];
                              list.splice(idx, 1);
                              setFormData({ ...formData, roomTypes: list });
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xs"
                          >
                            Remove
                          </button>
                          <div>
                            <label className="text-[10px] text-gray-400 block mb-1">Room Name</label>
                            <input 
                              type="text" 
                              placeholder="E.g., Deluxe Double Room" 
                              required
                              value={room.name || ''}
                              onChange={e => {
                                const list = [...formData.roomTypes];
                                list[idx].name = e.target.value;
                                setFormData({ ...formData, roomTypes: list });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Price per Night ($)</label>
                              <input 
                                type="number" 
                                required
                                value={room.pricePerNight}
                                onChange={e => {
                                  const list = [...formData.roomTypes];
                                  list[idx].pricePerNight = parseInt(e.target.value);
                                  setFormData({ ...formData, roomTypes: list });
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Max Guests</label>
                              <input 
                                type="number" 
                                required
                                value={room.capacity}
                                onChange={e => {
                                  const list = [...formData.roomTypes];
                                  list[idx].capacity = parseInt(e.target.value);
                                  setFormData({ ...formData, roomTypes: list });
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 block mb-1">Room Image URL</label>
                            <input 
                              type="url" 
                              placeholder="https://..."
                              value={room.image || ''}
                              onChange={e => {
                                const list = [...formData.roomTypes];
                                list[idx].image = e.target.value;
                                setFormData({ ...formData, roomTypes: list });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-green-600/10 text-center"
                >
                  {editItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
