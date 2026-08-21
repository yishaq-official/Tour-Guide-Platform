import { useState, useEffect } from 'react';
import { Landmark, Compass, Hotel, Car, Plus, LogOut, ArrowLeft, Trash2, Edit3, Loader2, Star, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL, apiFetch } from '../config';

type TabType = 'heritages' | 'cultures' | 'hotels' | 'vehicles';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('heritages');
  const [heritages, setHeritages] = useState<any[]>([]);
  const [cultures, setCultures] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States to trigger Step 12 modals
  const [editItem, setEditItem] = useState<{ type: TabType; data: any } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
              onClick={() => setIsAddModalOpen(true)}
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
                              onClick={() => setEditItem({ type: activeTab, data: item })}
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
    </div>
  );
}
