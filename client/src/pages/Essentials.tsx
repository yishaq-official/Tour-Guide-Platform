import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, Landmark, FileText, PhoneCall, CreditCard, 
  Car, Wallet, CheckCircle2, ArrowRight, Globe, Download, QrCode, Zap, MapPin,
  Volume2, MessageSquareQuote, ZapOff, Heart
} from 'lucide-react';

interface Phrase {
  amharic: string;
  script: string;
  phonetic: string;
  english: string;
  category: 'greetings' | 'dining' | 'directions';
}

const PHRASES: Phrase[] = [
  // Greetings
  { amharic: 'ሰላም', script: 'Selam', phonetic: 'Seh-lahm', english: 'Hello / Peace', category: 'greetings' },
  { amharic: 'አመሰግናለሁ', script: 'Ameseginalehu', phonetic: 'Ah-meh-seh-gih-nah-leh-hoo', english: 'Thank you', category: 'greetings' },
  { amharic: 'እሺ', script: 'Ishi', phonetic: 'Ee-shee', english: 'Okay / Yes', category: 'greetings' },
  { amharic: 'ደህና ሁን', script: 'Dehna Hun', phonetic: 'Deh-nah Hoon', english: 'Goodbye (to a male)', category: 'greetings' },
  { amharic: 'ደህና ሁኚ', script: 'Dehna Huni', phonetic: 'Deh-nah Hoo-nee', english: 'Goodbye (to a female)', category: 'greetings' },
  { amharic: 'እንዴት ነህ?', script: 'Indet Neh?', phonetic: 'In-date Neh?', english: 'How are you? (to a male)', category: 'greetings' },
  { amharic: 'እንዴት ነሽ?', script: 'Indet Nesh?', phonetic: 'In-date Nesh?', english: 'How are you? (to a female)', category: 'greetings' },
  
  // Dining & Shopping
  { amharic: 'ስንት ነው?', script: 'Sint Now?', phonetic: 'Sin-t Now?', english: 'How much is it?', category: 'dining' },
  { amharic: 'ቆንጆ', script: 'Konjo', phonetic: 'Kohn-joh', english: 'Beautiful / Delicious', category: 'dining' },
  { amharic: 'ውሃ አምጣልኝ', script: 'Wuha Amtalign', phonetic: 'Woo-hah Ahm-tah-leen', english: 'Bring me water', category: 'dining' },
  { amharic: 'ቡና', script: 'Buna', phonetic: 'Boo-nah', english: 'Coffee', category: 'dining' },
  { amharic: 'ሒሳብ አምጣልኝ', script: 'Hisab Amtalign', phonetic: 'Hee-sahb Ahm-tah-leen', english: 'Bring the bill', category: 'dining' },
  
  // Directions & Emergencies
  { amharic: 'የት ነው?', script: 'Yet Now?', phonetic: 'Yeh-t Now?', english: 'Where is it?', category: 'directions' },
  { amharic: 'እባክህ እርዳኝ', script: 'Ebakih Irdagn', phonetic: 'Eh-bah-keeh Ihr-dahn-y', english: 'Please help me', category: 'directions' },
  { amharic: 'ታክሲ', script: 'Taxi', phonetic: 'Tahk-see', english: 'Taxi', category: 'directions' },
  { amharic: 'ሆቴል', script: 'Hotel', phonetic: 'Hoh-tehl', english: 'Hotel', category: 'directions' }
];

export function Essentials() {
  const [activeTelecomTab, setActiveTelecomTab] = useState<'ethio' | 'safaricom'>('ethio');
  const [activePhraseTab, setActivePhraseTab] = useState<'all' | 'greetings' | 'dining' | 'directions'>('all');
  const [playedPhrase, setPlayedPhrase] = useState<string | null>(null);

  const speakPhrase = (text: string) => {
    setPlayedPhrase(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.lang = 'am-ET';
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setPlayedPhrase(null), 1500);
  };

  const filteredPhrases = activePhraseTab === 'all' 
    ? PHRASES 
    : PHRASES.filter(p => p.category === activePhraseTab);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Ethiopia Tourist Essentials</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your complete guide to mobile networks, digital wallets, ride-hailing apps, power standards, visas, and interactive Amharic phrasebook.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 space-y-12">

        {/* 1. TELECOM & SIM CARDS SECTION */}
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
                onClick={() => setActiveTelecomTab('ethio')}
                className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  activeTelecomTab === 'ethio' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                Ethio Telecom
              </button>
              <button
                onClick={() => setActiveTelecomTab('safaricom')}
                className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
                  activeTelecomTab === 'safaricom' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
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
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Provider Coverage</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {activeTelecomTab === 'ethio' ? 'Ethio Telecom (National Network)' : 'Safaricom Ethiopia (Private)'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {activeTelecomTab === 'ethio'
                    ? 'Extensive nationwide coverage across all regional states, including remote historical destinations like Lalibela, Aksum, Gondar, and Omo Valley.'
                    : 'Ultra-fast 4G/5G data networks optimized for urban regions including Addis Ababa, Dire Dawa, Hawassa, and Adama.'}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-150 text-xs font-semibold text-gray-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-600" />
                <span>Network: {activeTelecomTab === 'ethio' ? '99% Nationwide Coverage' : 'Urban Centers & Business Hubs'}</span>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 p-6 rounded-2xl border border-green-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-green-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">Weekly Bundle</span>
                    <span className="text-lg font-black text-gray-900">$5 USD <span className="text-xs text-gray-500 font-normal">(~600 ETB)</span></span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Tourist Starter Pack</h4>
                  <p className="text-xs text-gray-600 mb-4">Ideal for short city breaks and transit stays.</p>
                  <ul className="space-y-2 text-xs font-semibold text-gray-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 10 GB High-Speed Data</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 100 Local Call Minutes</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> Instant Digital Wallet Setup</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-green-200/60 text-[11px] font-bold text-green-800">
                  Validity: 7 Days
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-2xl border border-blue-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">Monthly Bundle</span>
                    <span className="text-lg font-black text-gray-900">$14 USD <span className="text-xs text-gray-500 font-normal">(~1,600 ETB)</span></span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Explorer Heavy Pack</h4>
                  <p className="text-xs text-gray-600 mb-4">Designed for multi-city itineraries and remote tours.</p>
                  <ul className="space-y-2 text-xs font-semibold text-gray-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 35 GB High-Speed Data</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 300 Local Call Minutes</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 50 SMS Messages</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-200/60 text-[11px] font-bold text-blue-800">
                  Validity: 30 Days
                </div>
              </div>
            </div>
          </div>

          {/* SIM Process */}
          <div className="bg-gray-900 text-white p-6 sm:p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-400">
              <Zap className="w-5 h-5" /> Step-by-Step Process to Acquire a SIM Card
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/80 p-5 rounded-xl border border-gray-700">
                <span className="w-7 h-7 bg-green-500 text-gray-900 text-xs font-black rounded-full flex items-center justify-center mb-3">1</span>
                <h4 className="font-bold text-sm text-white mb-2">Visit Official Kiosk</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Head to the official SIM booth inside <strong>Addis Ababa Bole Airport (Terminal 2 Arrivals)</strong> or any official city branch.
                </p>
              </div>

              <div className="bg-gray-800/80 p-5 rounded-xl border border-gray-700">
                <span className="w-7 h-7 bg-green-500 text-gray-900 text-xs font-black rounded-full flex items-center justify-center mb-3">2</span>
                <h4 className="font-bold text-sm text-white mb-2">Present Original Passport</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Provide your <strong>original physical passport</strong>. Ethiopian telecom regulations mandate biometric registration for SIM activation.
                </p>
              </div>

              <div className="bg-gray-800/80 p-5 rounded-xl border border-gray-700">
                <span className="w-7 h-7 bg-green-500 text-gray-900 text-xs font-black rounded-full flex items-center justify-center mb-3">3</span>
                <h4 className="font-bold text-sm text-white mb-2">Activate Package</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Insert the SIM, enable mobile roaming/data, and dial <strong>*999#</strong> (Ethio Telecom) or <strong>*777#</strong> (Safaricom) to select your package.
                </p>
              </div>
            </div>
          </div>
        </motion.div>


        {/* 2. MOBILE MONEY & DIGITAL WALLETS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 sm:p-10"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">2. Mobile Money & Digital Wallets</h2>
              <p className="text-sm text-gray-500">Go cashless! Pay at cafes, taxis, and heritage sites using your mobile phone.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Telebirr</h3>
                  <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Ethio Telecom Wallet</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  The primary digital wallet in Ethiopia accepted by over 500,000 merchants, hotels, restaurants, and taxis nationwide.
                </p>
                <div className="space-y-2 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2"><QrCode className="w-4 h-4 text-emerald-600" /> Instant QR Code Merchant Payments</div>
                  <div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-600" /> Linked with Commercial Bank of Ethiopia (CBE)</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">M-PESA Ethiopia</h3>
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">Safaricom Wallet</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Powered by Safaricom, offering peer-to-peer transfers, bill payments, and agent cash-in/cash-out services.
                </p>
                <div className="space-y-2 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2"><QrCode className="w-4 h-4 text-red-600" /> Fast Digital Cash Transfers</div>
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-red-600" /> Regional Cross-Border Transfers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Setup Steps */}
          <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Download className="w-5 h-5 text-green-700" /> How to Set Up & Use Mobile Money as a Tourist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs font-black text-green-700 mb-2">STEP 1</div>
                <h4 className="font-bold text-sm text-gray-900 mb-2">Download App</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Install <strong>Telebirr</strong> or <strong>M-PESA Ethiopia</strong> from Google Play Store or Apple App Store.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs font-black text-green-700 mb-2">STEP 2</div>
                <h4 className="font-bold text-sm text-gray-900 mb-2">Register Number</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Open the app and complete quick SMS registration using your active local Ethiopian phone number.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs font-black text-green-700 mb-2">STEP 3</div>
                <h4 className="font-bold text-sm text-gray-900 mb-2">Cash-In / Top Up</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Visit any official agent booth, bank branch, or airport kiosk to deposit local cash (ETB) into your wallet.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs font-black text-green-700 mb-2">STEP 4</div>
                <h4 className="font-bold text-sm text-gray-900 mb-2">Scan & Pay</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Scan the merchant's printed QR code or enter their Till Number at checkout to pay instantly without physical cash.
                </p>
              </div>
            </div>
          </div>
        </motion.div>


        {/* 3. LOCAL RIDE-HAILING APPS SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 sm:p-10"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">3. Local Ride-Hailing Apps</h2>
              <p className="text-sm text-gray-500">Book safe, fixed-rate taxi rides around Addis Ababa and major cities.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-green-700 uppercase bg-green-100 px-2 py-0.5 rounded">Most Popular</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">Feres Taxi</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Largest fleet in Addis Ababa. Offers cashback points and accepts cash, Telebirr, and bank transfers.
                </p>
              </div>
              <div className="text-[11px] font-bold text-gray-400">Shortcode Dial: 6090</div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">Established</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">RIDE Transport</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Highly reliable service with fast driver dispatches for airport pickups and city tours.
                </p>
              </div>
              <div className="text-[11px] font-bold text-gray-400">Shortcode Dial: 8294</div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-yellow-700 uppercase bg-yellow-100 px-2 py-0.5 rounded">Upfront Rates</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">Yango Ethiopia</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Global app providing guaranteed upfront fare pricing before you request the vehicle.
                </p>
              </div>
              <div className="text-[11px] font-bold text-gray-400">App-Based Booking</div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-teal-700 uppercase bg-teal-100 px-2 py-0.5 rounded">Flexible Fleet</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">ZayRide</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Offers options for compact cars, mini-vans, and scheduled long-distance trips.
                </p>
              </div>
              <div className="text-[11px] font-bold text-gray-400">Shortcode Dial: 6300</div>
            </div>
          </div>

          {/* Ride Booking Steps */}
          <div className="bg-green-950 text-white p-6 sm:p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-300">
              <MapPin className="w-5 h-5" /> How to Book a Ride-Hailing Taxi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-900/60 p-5 rounded-xl border border-green-800">
                <div className="text-xs font-black text-green-400 mb-2">STEP 1</div>
                <h4 className="font-bold text-sm text-white mb-2">Install App</h4>
                <p className="text-xs text-green-200 leading-relaxed">
                  Download <strong>Feres</strong> or <strong>RIDE</strong> from App Store or Google Play Store.
                </p>
              </div>

              <div className="bg-green-900/60 p-5 rounded-xl border border-green-800">
                <div className="text-xs font-black text-green-400 mb-2">STEP 2</div>
                <h4 className="font-bold text-sm text-white mb-2">Register Number</h4>
                <p className="text-xs text-green-200 leading-relaxed">
                  Enter your local Ethiopian mobile phone number to receive a verification OTP code.
                </p>
              </div>

              <div className="bg-green-900/60 p-5 rounded-xl border border-green-800">
                <div className="text-xs font-black text-green-400 mb-2">STEP 3</div>
                <h4 className="font-bold text-sm text-white mb-2">Set Destination</h4>
                <p className="text-xs text-green-200 leading-relaxed">
                  Turn on location permissions, select pickup point (e.g. Bole Airport), enter destination, and confirm ride.
                </p>
              </div>

              <div className="bg-green-900/60 p-5 rounded-xl border border-green-800">
                <div className="text-xs font-black text-green-400 mb-2">STEP 4</div>
                <h4 className="font-bold text-sm text-white mb-2">Pay & Travel</h4>
                <p className="text-xs text-green-200 leading-relaxed">
                  Pay your driver at the end of the journey using local cash, Telebirr, or M-PESA.
                </p>
              </div>
            </div>
          </div>
        </motion.div>


        {/* 4. POWER, PLUG TYPES & VOLTAGE SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 sm:p-10"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
              <ZapOff className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">4. Power Standards, Plugs & Voltage</h2>
              <p className="text-sm text-gray-500">Electrical standards and essential advice for charging devices.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-center">
              <span className="text-3xl font-black text-amber-700 block mb-2">220V</span>
              <h4 className="font-bold text-sm text-gray-900 mb-1">Standard Voltage</h4>
              <p className="text-xs text-gray-600">Standard voltage in Ethiopia is 220V at 50Hz frequency. Dual-voltage devices (110V-240V) work seamlessly.</p>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-center">
              <span className="text-3xl font-black text-amber-700 block mb-2">Type C & F</span>
              <h4 className="font-bold text-sm text-gray-900 mb-1">Plug Outlets</h4>
              <p className="text-xs text-gray-600">Power outlets fit Europlug 2-pin round plugs (Type C and Type F). Bring a universal adapter for US/UK plugs.</p>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-center">
              <span className="text-3xl font-black text-amber-700 block mb-2">Power Bank</span>
              <h4 className="font-bold text-sm text-gray-900 mb-1">Travel Tip</h4>
              <p className="text-xs text-gray-600">Power outages occasionally happen during heavy rains. Carrying a 10,000mAh+ portable power bank is highly recommended.</p>
            </div>
          </div>
        </motion.div>


        {/* 5. INTERACTIVE AMHARIC PHRASEBOOK & CULTURAL ETIQUETTE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 sm:p-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <MessageSquareQuote className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">5. Interactive Amharic Phrasebook</h2>
                <p className="text-sm text-gray-500">Learn key words, pronunciation, and cultural etiquette for your journey.</p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-xl border border-gray-200">
              <button
                onClick={() => setActivePhraseTab('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activePhraseTab === 'all' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                All Words
              </button>
              <button
                onClick={() => setActivePhraseTab('greetings')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activePhraseTab === 'greetings' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                Greetings
              </button>
              <button
                onClick={() => setActivePhraseTab('dining')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activePhraseTab === 'dining' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                Shopping & Dining
              </button>
              <button
                onClick={() => setActivePhraseTab('directions')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activePhraseTab === 'directions' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                Directions
              </button>
            </div>
          </div>

          {/* Phrases Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {filteredPhrases.map((phrase, idx) => (
              <div 
                key={idx}
                className="bg-gray-50 hover:bg-green-50/50 p-4 rounded-2xl border border-gray-150 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-2xl font-bold text-gray-900 font-serif">{phrase.amharic}</div>
                  <div className="text-sm font-bold text-green-700 mt-0.5">{phrase.script} <span className="text-xs font-normal text-gray-400">({phrase.phonetic})</span></div>
                  <div className="text-xs font-medium text-gray-600 mt-1">{phrase.english}</div>
                </div>

                <button
                  onClick={() => speakPhrase(phrase.script)}
                  className={`p-3 rounded-xl transition-colors ${
                    playedPhrase === phrase.script ? 'bg-green-600 text-white' : 'bg-white text-gray-500 group-hover:text-green-600 shadow-sm border border-gray-150'
                  }`}
                  title="Listen Pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Cultural Etiquette & Tipping Guide */}
          <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-gray-900 text-white p-6 sm:p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-300">
              <Heart className="w-5 h-5 text-green-400" /> Tipping Customs & Cultural Etiquette
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-950/60 p-5 rounded-xl border border-green-800">
                <h4 className="font-bold text-sm text-white mb-2">Restaurant Tipping</h4>
                <p className="text-xs text-green-200 leading-relaxed">
                  Tipping 5% to 10% of the total bill is customary at sit-down restaurants and cafes. A small cash tip of 50-100 ETB for hotel porters is appreciated.
                </p>
              </div>

              <div className="bg-green-950/60 p-5 rounded-xl border border-green-800">
                <h4 className="font-bold text-sm text-white mb-2">Coffee Ceremony Ritual</h4>
                <p className="text-xs text-green-200 leading-relaxed">
                  If invited to a traditional Ethiopian coffee ceremony (Buna), it is respectful to accept at least the first round (*Abol*). It is customary to compliment the hostess.
                </p>
              </div>

              <div className="bg-green-950/60 p-5 rounded-xl border border-green-800">
                <h4 className="font-bold text-sm text-white mb-2">Greetings & Handshakes</h4>
                <p className="text-xs text-green-200 leading-relaxed">
                  Light shoulder-bumping (*Gursha* / shoulder touch) during handshakes is a common sign of warm friendship and respect between acquaintances.
                </p>
              </div>
            </div>
          </div>
        </motion.div>


        {/* 6. BANKING, VISA & EMERGENCY QUICK REFERENCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Banking */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 text-green-700 rounded-xl flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Banking & Money</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                The official currency is the Ethiopian Birr (ETB). ATMs operated by <strong>Commercial Bank of Ethiopia (CBE)</strong>, <strong>Dashen Bank</strong>, and <strong>Awash Bank</strong> accept foreign Visa & Mastercard.
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-150 text-xs font-semibold text-gray-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-600" />
              <span>Exchange foreign currency at official banks only.</span>
            </div>
          </motion.div>

          {/* Visa Requirements */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-700 rounded-xl flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Official e-Visa</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Apply online before departure via the official government portal. 30-Day single-entry tourist visa is $62 USD.
              </p>
            </div>
            <a 
              href="https://www.evisa.gov.et" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors gap-2"
            >
              Official e-Visa Portal <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-50 text-red-700 rounded-xl flex items-center justify-center font-bold">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Emergency Contacts</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-800">
                <div className="bg-red-50 p-2.5 rounded-xl text-center border border-red-100">
                  <div className="text-red-600 text-base">991</div>
                  <div className="text-[10px] text-gray-500">Police</div>
                </div>
                <div className="bg-red-50 p-2.5 rounded-xl text-center border border-red-100">
                  <div className="text-red-600 text-base">902</div>
                  <div className="text-[10px] text-gray-500">Ambulance</div>
                </div>
                <div className="bg-red-50 p-2.5 rounded-xl text-center border border-red-100">
                  <div className="text-red-600 text-base">939</div>
                  <div className="text-[10px] text-gray-500">Fire</div>
                </div>
                <div className="bg-red-50 p-2.5 rounded-xl text-center border border-red-100">
                  <div className="text-red-600 text-base">8335</div>
                  <div className="text-[10px] text-gray-500">Tourist Police</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-400 font-semibold text-center">
              Toll-free numbers dialable from any phone.
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
