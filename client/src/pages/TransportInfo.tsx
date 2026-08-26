import { motion } from 'framer-motion';
import { Plane, Bus, Train, Car } from 'lucide-react';

export function TransportInfo() {
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
            <Plane className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Navigating Ethiopia</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6"
          >
            Getting Around <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-200">Ethiopia</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            From domestic flights spanning the country to comfortable intercity buses and local ride-hailing, navigate Ethiopia smoothly and safely.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Flights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
              <Plane className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">Domestic Flights</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              <strong>Ethiopian Airlines</strong> operates an extensive and highly reliable domestic network connecting Addis Ababa to major tourist destinations like Lalibela, Gondar, Aksum, and Arba Minch.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>Tip: International passengers flying with Ethiopian Airlines get significant discounts on domestic flights.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>Book well in advance during peak tourist seasons (Sept - Jan).</span>
              </li>
            </ul>
          </motion.div>

          {/* Buses */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
              <Bus className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">Intercity Buses</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              For budget travelers, luxury buses like <strong>Selam Bus</strong> and <strong>Sky Bus</strong> offer comfortable, safe, and affordable travel between major cities.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>Buses typically depart very early in the morning (5:00 AM - 6:00 AM) from Meskel Square.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>Tickets must be purchased at least a day in advance from their official ticket offices.</span>
              </li>
            </ul>
          </motion.div>

          {/* Trains */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
              <Train className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">Railway</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The <strong>Ethio-Djibouti Railway</strong> is a modern standard-gauge railway connecting Addis Ababa to Djibouti, passing through eastern cities like Adama and Dire Dawa.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>Great option for traveling to eastern Ethiopia (e.g., Harar, via Dire Dawa).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>Tickets are available at Furi-Lebu railway station in Addis Ababa.</span>
              </li>
            </ul>
          </motion.div>

          {/* Local Transport */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
              <Car className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">Local Transport & Ride-Hailing</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              In Addis Ababa, blue-and-white minibuses are everywhere. For more comfort, local ride-hailing apps like <strong>Ride</strong> and <strong>Feres</strong> are highly recommended.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>Download the 'Ride' or 'Feres' app; they work similarly to Uber.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>Fares are generally paid in cash (Birr) at the end of the trip.</span>
              </li>
            </ul>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
