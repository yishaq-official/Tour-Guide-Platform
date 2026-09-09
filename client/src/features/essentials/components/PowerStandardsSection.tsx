import { motion } from "framer-motion";
import { ZapOff } from "lucide-react";

export function PowerStandardsSection() {
  return (
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
          <p className="text-sm text-gray-500">
            Electrical standards and essential advice for charging devices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-center">
          <span className="text-3xl font-black text-amber-700 block mb-2">220V</span>
          <h4 className="font-bold text-sm text-gray-900 mb-1">Standard Voltage</h4>
          <p className="text-xs text-gray-600">
            Standard voltage in Ethiopia is 220V at 50Hz frequency. Dual-voltage devices (110V-240V) work seamlessly.
          </p>
        </div>

        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-center">
          <span className="text-3xl font-black text-amber-700 block mb-2">Type C & F</span>
          <h4 className="font-bold text-sm text-gray-900 mb-1">Plug Outlets</h4>
          <p className="text-xs text-gray-600">
            Power outlets fit Europlug 2-pin round plugs (Type C and Type F). Bring a universal adapter for US/UK plugs.
          </p>
        </div>

        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 text-center">
          <span className="text-3xl font-black text-amber-700 block mb-2">Power Bank</span>
          <h4 className="font-bold text-sm text-gray-900 mb-1">Travel Tip</h4>
          <p className="text-xs text-gray-600">
            Power outages occasionally happen during heavy rains. Carrying a 10,000mAh+ portable power bank is highly recommended.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
