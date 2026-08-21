import { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Compass, Hotel, Car, Plus, LogOut, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type TabType = 'heritages' | 'cultures' | 'hotels' | 'vehicles';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('heritages');

  const tabs = [
    { id: 'heritages' as TabType, label: 'Heritages', icon: Landmark, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'cultures' as TabType, label: 'Cultures', icon: Compass, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'hotels' as TabType, label: 'Hotels', icon: Hotel, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'vehicles' as TabType, label: 'Vehicles', icon: Car, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  ];

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
          
          <button className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/50 px-4 py-2.5 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Quick Statistics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Heritages', value: '12', icon: Landmark, bg: 'bg-amber-500/10 text-amber-700' },
            { label: 'Total Cultures', value: '8', icon: Compass, bg: 'bg-purple-500/10 text-purple-700' },
            { label: 'Registered Hotels', value: '6', icon: Hotel, bg: 'bg-emerald-500/10 text-emerald-700' },
            { label: 'Registered Vehicles', value: '15', icon: Car, bg: 'bg-blue-500/10 text-blue-700' },
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
            
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-green-600/10 text-sm">
              <Plus className="w-4 h-4" /> Add New {activeTab.slice(0, -1)}
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="p-8">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Landmark className="w-12 h-12 text-gray-300 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Catalog List Loading</h3>
              <p className="text-sm text-gray-500 max-w-sm">Fetching catalog resources from backend database...</p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
