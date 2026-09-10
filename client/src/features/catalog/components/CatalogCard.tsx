import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight } from "lucide-react";

interface CatalogCardProps {
  item: any;
  activeTab: "cultures" | "heritages";
  index: number;
}

export function CatalogCard({ item, activeTab, index }: CatalogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group border border-gray-150 flex flex-col h-full"
    >
      {/* Card Header & Image */}
      <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Dark Overlay Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Left Tag */}
        {(item.region || item.category) && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md border border-gray-150/60 tracking-tight">
            {item.region || item.category}
          </div>
        )}

        {/* Top Right UNESCO Gold Badge */}
        {item.isUnesco && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
            <Star className="w-3.5 h-3.5 fill-current text-amber-950" />
            UNESCO
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-snug group-hover:text-green-700 transition-colors line-clamp-1">
            {item.name}
          </h3>

          <div className="flex items-center text-emerald-700 font-semibold text-xs mb-4">
            <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-emerald-600" />
            <span className="truncate">{item.location}</span>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm mb-6 line-clamp-3 leading-relaxed">
            {item.history ? item.history.replace(/\*/g, "") : ""}
          </p>
        </div>

        {/* Card Footer Button */}
        <Link
          to={`/explore/${activeTab === "heritages" ? "heritage" : "culture"}/${item._id}`}
          className="inline-flex items-center justify-between w-full py-3.5 px-5 bg-gray-900 group-hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all duration-300 shadow-md group-hover:shadow-green-700/25"
        >
          <span>Discover {activeTab === "heritages" ? "Journey" : "Tradition"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
