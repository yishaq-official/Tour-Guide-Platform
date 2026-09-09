import { motion } from "framer-motion";
import { Car, MapPin } from "lucide-react";

export function RideHailingSection() {
  return (
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
          <p className="text-sm text-gray-500">
            Book safe, fixed-rate taxi rides around Addis Ababa and major cities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-green-700 uppercase bg-green-100 px-2 py-0.5 rounded">
              Most Popular
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">Feres Taxi</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Largest fleet in Addis Ababa. Offers cashback points and accepts cash, Telebirr, and bank transfers.
            </p>
          </div>
          <div className="text-[11px] font-bold text-gray-400">Shortcode Dial: 6090</div>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
              Established
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">RIDE Transport</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Highly reliable service with fast driver dispatches for airport pickups and city tours.
            </p>
          </div>
          <div className="text-[11px] font-bold text-gray-400">Shortcode Dial: 8294</div>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-yellow-700 uppercase bg-yellow-100 px-2 py-0.5 rounded">
              Upfront Rates
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">Yango Ethiopia</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Global app providing guaranteed upfront fare pricing before you request the vehicle.
            </p>
          </div>
          <div className="text-[11px] font-bold text-gray-400">App-Based Booking</div>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-teal-700 uppercase bg-teal-100 px-2 py-0.5 rounded">
              Flexible Fleet
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">ZayRide</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Offers options for compact cars, mini-vans, and scheduled long-distance trips.
            </p>
          </div>
          <div className="text-[11px] font-bold text-gray-400">Shortcode Dial: 6300</div>
        </div>
      </div>

      {/* Ride Booking Steps */}
      <div className="bg-gradient-to-br from-emerald-950 via-gray-900 to-green-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl">
        <h3 className="text-lg font-extrabold mb-6 flex items-center gap-2.5 text-emerald-400">
          <MapPin className="w-5 h-5 text-emerald-400 animate-pulse" /> How to Book a Ride-Hailing Taxi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-black text-emerald-400 mb-2">STEP 1</div>
            <h4 className="font-bold text-sm text-white mb-2">Install App</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Download <strong className="text-emerald-300">Feres</strong> or{" "}
              <strong className="text-emerald-300">RIDE</strong> from App Store or Google Play Store.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-black text-emerald-400 mb-2">STEP 2</div>
            <h4 className="font-bold text-sm text-white mb-2">Register Number</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Enter your local Ethiopian mobile phone number to receive a verification OTP code.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-black text-emerald-400 mb-2">STEP 3</div>
            <h4 className="font-bold text-sm text-white mb-2">Set Destination</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Turn on location permissions, select pickup point (e.g. Bole Airport), enter destination, and confirm ride.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-black text-emerald-400 mb-2">STEP 4</div>
            <h4 className="font-bold text-sm text-white mb-2">Pay & Travel</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Pay your driver at the end of the journey using local cash, Telebirr, or M-PESA.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
