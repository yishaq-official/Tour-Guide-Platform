import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Globe, CheckCircle2, Zap } from "lucide-react";

export function TelecomSection() {
  const [activeTelecomTab, setActiveTelecomTab] = useState<"ethio" | "safaricom">("ethio");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 sm:p-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">1. SIM Cards & Mobile Networks</h2>
            <p className="text-sm text-gray-500">Stay connected with high-speed 4G/5G mobile internet.</p>
          </div>
        </div>

        {/* Telecom Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTelecomTab("ethio")}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              activeTelecomTab === "ethio" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
            }`}
          >
            Ethio Telecom
          </button>
          <button
            onClick={() => setActiveTelecomTab("safaricom")}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
              activeTelecomTab === "safaricom" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"
            }`}
          >
            Safaricom Ethiopia
          </button>
        </div>
      </div>

      {/* Telecom Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Provider Coverage
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {activeTelecomTab === "ethio"
                ? "Ethio Telecom (National Network)"
                : "Safaricom Ethiopia (Private)"}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {activeTelecomTab === "ethio"
                ? "Extensive nationwide coverage across all regional states, including remote historical destinations like Lalibela, Aksum, Gondar, and Omo Valley."
                : "Ultra-fast 4G/5G data networks optimized for urban regions including Addis Ababa, Dire Dawa, Hawassa, and Adama."}
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-150 text-xs font-semibold text-gray-700 flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            <span>
              Network: {activeTelecomTab === "ethio" ? "99% Nationwide Coverage" : "Urban Centers & Business Hubs"}
            </span>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 p-6 rounded-2xl border border-green-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-green-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Weekly Bundle
                </span>
                <span className="text-lg font-black text-gray-900">
                  $5 USD <span className="text-xs text-gray-500 font-normal">(~600 ETB)</span>
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">Tourist Starter Pack</h4>
              <p className="text-xs text-gray-600 mb-4">Ideal for short city breaks and transit stays.</p>
              <ul className="space-y-2 text-xs font-semibold text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> 10 GB High-Speed Data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> 100 Local Call Minutes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Instant Digital Wallet Setup
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-green-200/60 text-[11px] font-bold text-green-800">
              Validity: 7 Days
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-2xl border border-blue-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Monthly Bundle
                </span>
                <span className="text-lg font-black text-gray-900">
                  $14 USD <span className="text-xs text-gray-500 font-normal">(~1,600 ETB)</span>
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">Explorer Heavy Pack</h4>
              <p className="text-xs text-gray-600 mb-4">Designed for multi-city itineraries and remote tours.</p>
              <ul className="space-y-2 text-xs font-semibold text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> 35 GB High-Speed Data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> 300 Local Call Minutes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> 50 SMS Messages
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200/60 text-[11px] font-bold text-blue-800">
              Validity: 30 Days
            </div>
          </div>
        </div>
      </div>

      {/* SIM Process */}
      <div className="bg-gradient-to-br from-emerald-950 via-gray-900 to-green-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl">
        <h3 className="text-lg font-extrabold mb-6 flex items-center gap-2.5 text-emerald-400">
          <Zap className="w-5 h-5 text-emerald-400 animate-pulse" /> Step-by-Step Process to Acquire a SIM Card
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="w-8 h-8 bg-emerald-500 text-gray-950 font-black rounded-xl flex items-center justify-center mb-4 text-xs shadow-md">
              1
            </div>
            <h4 className="font-bold text-sm text-white mb-2">Visit Official Kiosk</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Head to the official SIM booth inside{" "}
              <strong className="text-emerald-300">Addis Ababa Bole Airport (Terminal 2 Arrivals)</strong> or any official city branch.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="w-8 h-8 bg-emerald-500 text-gray-950 font-black rounded-xl flex items-center justify-center mb-4 text-xs shadow-md">
              2
            </div>
            <h4 className="font-bold text-sm text-white mb-2">Present Original Passport</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Provide your <strong className="text-emerald-300">original physical passport</strong>. Ethiopian telecom regulations mandate biometric registration for SIM activation.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="w-8 h-8 bg-emerald-500 text-gray-950 font-black rounded-xl flex items-center justify-center mb-4 text-xs shadow-md">
              3
            </div>
            <h4 className="font-bold text-sm text-white mb-2">Activate Package</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Insert the SIM, enable mobile roaming/data, and dial{" "}
              <strong className="text-emerald-300">*999#</strong> (Ethio Telecom) or{" "}
              <strong className="text-emerald-300">*777#</strong> (Safaricom) to select your package.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
