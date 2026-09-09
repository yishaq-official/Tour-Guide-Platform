import { motion } from "framer-motion";

export function ServicesHero() {
  return (
    <div className="relative bg-gradient-to-r from-gray-950 via-gray-900 to-green-950 text-white py-16 sm:py-20 mb-12 rounded-b-3xl sm:rounded-b-[2.5rem] overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6"
        >
          Hospitality & Transport
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8"
        >
          Book verified luxury stays, boutique lodges, and reliable 4x4 vehicles with driver options
          across Ethiopia.
        </motion.p>
      </div>
    </div>
  );
}
