import { motion } from 'framer-motion';
import { Smartphone, Landmark, FileText, PhoneCall, ShieldAlert, CreditCard } from 'lucide-react';

export function Essentials() {
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Tourist Essentials</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to know before you arrive. Stay connected, manage your finances, and travel safely in Ethiopia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Telecom Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">SIM Cards & Telecom</h2>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Ethiopia currently has two major telecom providers. Getting a local SIM card is highly recommended for internet access.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-2">Ethio Telecom</h3>
                <p className="text-sm text-gray-600">The state-owned provider with the most extensive coverage nationwide, especially in rural areas.</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-2">Safaricom Ethiopia</h3>
                <p className="text-sm text-gray-600">A newer private provider offering excellent 4G/5G speeds in major cities like Addis Ababa, Dire Dawa, and Adama.</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Requirement: Bring your passport to purchase a SIM card.
              </p>
            </div>
          </motion.div>

          {/* Banking Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                <Landmark className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Banking & Money</h2>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              The local currency is the Ethiopian Birr (ETB). While hotels and large businesses accept cards, cash is essential for daily travel.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Commercial Bank of Ethiopia (CBE)</h3>
                  <p className="text-sm text-gray-600">The largest bank with the most ATMs nationwide. Most international Visa/Mastercards work here.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Landmark className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Currency Exchange</h3>
                  <p className="text-sm text-gray-600">Exchange foreign currency exclusively at official banks or authorized forex bureaus to avoid legal issues.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visa Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Visa Requirements</h2>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Most foreign nationals require a visa to enter Ethiopia. The process has been streamlined via the official e-Visa portal.
            </p>
            
            <a 
              href="https://www.evisa.gov.et" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors mb-4"
            >
              Visit Official e-Visa Portal
            </a>
            <p className="text-xs text-gray-500 text-center">
              Ensure your passport is valid for at least 6 months from your intended date of entry.
            </p>
          </motion.div>

          {/* Emergency Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                <PhoneCall className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Save these toll-free numbers. They can be dialed from any local mobile phone or landline without airtime.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">991</div>
                <div className="text-sm font-medium text-gray-900">Police</div>
              </div>
              <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">902</div>
                <div className="text-sm font-medium text-gray-900">Ambulance</div>
              </div>
              <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">939</div>
                <div className="text-sm font-medium text-gray-900">Fire Emergency</div>
              </div>
              <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">8335</div>
                <div className="text-sm font-medium text-gray-900">Tourist Police</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
