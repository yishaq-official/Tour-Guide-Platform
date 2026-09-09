import { motion } from "framer-motion";
import { Landmark, CreditCard, FileText, ArrowRight, PhoneCall } from "lucide-react";

export function QuickReferenceCards() {
  return (
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
            The official currency is the Ethiopian Birr (ETB). ATMs operated by{" "}
            <strong>Commercial Bank of Ethiopia (CBE)</strong>, <strong>Dashen Bank</strong>, and{" "}
            <strong>Awash Bank</strong> accept foreign Visa & Mastercard.
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
  );
}
