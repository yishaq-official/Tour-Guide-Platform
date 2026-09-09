import { motion } from "framer-motion";
import { Wallet, QrCode, Landmark, Globe, Download } from "lucide-react";

export function MobileMoneySection() {
  return (
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
          <p className="text-sm text-gray-500">
            Go cashless! Pay at cafes, taxis, and heritage sites using your mobile phone.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Telebirr</h3>
              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Ethio Telecom Wallet
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The primary digital wallet in Ethiopia accepted by over 500,000 merchants, hotels, restaurants, and taxis nationwide.
            </p>
            <div className="space-y-2 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" /> Instant QR Code Merchant Payments
              </div>
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600" /> Linked with Commercial Bank of Ethiopia (CBE)
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">M-PESA Ethiopia</h3>
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                Safaricom Wallet
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Powered by Safaricom, offering peer-to-peer transfers, bill payments, and agent cash-in/cash-out services.
            </p>
            <div className="space-y-2 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-red-600" /> Fast Digital Cash Transfers
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-600" /> Regional Cross-Border Transfers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Setup Steps */}
      <div className="bg-gradient-to-br from-emerald-950 via-gray-900 to-green-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl">
        <h3 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2.5">
          <Download className="w-5 h-5 text-emerald-400 animate-pulse" /> How to Set Up & Use Mobile Money as a Tourist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-black text-emerald-400 mb-2">STEP 1</div>
            <h4 className="font-bold text-sm text-white mb-2">Download App</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Install <strong className="text-emerald-300">Telebirr</strong> or <strong className="text-emerald-300">M-PESA Ethiopia</strong> from Google Play Store or Apple App Store.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-black text-emerald-400 mb-2">STEP 2</div>
            <h4 className="font-bold text-sm text-white mb-2">Register Number</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Open the app and complete quick SMS registration using your active local Ethiopian phone number.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-black text-emerald-400 mb-2">STEP 3</div>
            <h4 className="font-bold text-sm text-white mb-2">Cash-In / Top Up</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Visit any official agent booth, bank branch, or airport kiosk to deposit local cash (ETB) into your wallet.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <div className="text-xs font-black text-emerald-400 mb-2">STEP 4</div>
            <h4 className="font-bold text-sm text-white mb-2">Scan & Pay</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Scan the merchant's printed QR code or enter their Till Number at checkout to pay instantly without physical cash.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
