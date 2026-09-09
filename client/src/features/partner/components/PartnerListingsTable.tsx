import { motion } from "framer-motion";
import { Building, Car, Star, MapPin, Key, BadgeCheck, Edit3, Trash2, Plus } from "lucide-react";

interface PartnerListingsTableProps {
  isHotelView: boolean;
  hotels: any[];
  vehicles: any[];
  accent: {
    text: string;
    bg: string;
    button: string;
  };
  onAddHotel: () => void;
  onEditHotel: (hotel: any) => void;
  onDeleteHotel: (id: string) => void;
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: any) => void;
  onDeleteVehicle: (id: string) => void;
}

const panelClass =
  "rounded-[2rem] border border-white/10 bg-white/[0.92] shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl";

export function PartnerListingsTable({
  isHotelView,
  hotels,
  vehicles,
  accent,
  onAddHotel,
  onEditHotel,
  onDeleteHotel,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
}: PartnerListingsTableProps) {
  if (isHotelView) {
    if (hotels.length === 0) {
      return (
        <div className={`${panelClass} p-12 text-center`}>
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${accent.bg} ${accent.text}`}>
            <Building className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-950">No registered hotels yet</h3>
          <p className="mx-auto mt-3 max-w-md text-slate-500">
            Build your first listing to start receiving bookings and showcase your hospitality brand.
          </p>
          <button
            onClick={onAddHotel}
            className={`mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg ${accent.button}`}
          >
            <Plus className="h-4 w-4" />
            Register Hotel
          </button>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {hotels.map((hotel) => (
          <motion.article
            key={hotel._id}
            whileHover={{ y: -6 }}
            className={`${panelClass} overflow-hidden`}
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={
                  hotel.image ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200"
                }
                alt={hotel.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-lg backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
                {hotel.rating}
              </div>
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5" />
                {hotel.location}
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-950">{hotel.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">{hotel.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities?.slice(0, 3).map((amenity: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {amenity}
                  </span>
                ))}
                {hotel.amenities?.length > 3 && (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-400">
                    +{hotel.amenities.length - 3} more
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">Price Nightly</div>
                  <div className={`mt-1 text-2xl font-black ${accent.text}`}>${hotel.pricePerNight}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditHotel(hotel)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    title="Edit Hotel"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteHotel(hotel._id)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                    title="Delete Hotel"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    );
  }

  // Vehicle view
  if (vehicles.length === 0) {
    return (
      <div className={`${panelClass} p-12 text-center`}>
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${accent.bg} ${accent.text}`}>
          <Car className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-950">No registered vehicles yet</h3>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          Add your first rental vehicle and turn your fleet into a premium booking catalog.
        </p>
        <button
          onClick={onAddVehicle}
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg ${accent.button}`}
        >
          <Plus className="h-4 w-4" />
          List Vehicle
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <motion.article
          key={vehicle._id}
          whileHover={{ y: -6 }}
          className={`${panelClass} overflow-hidden`}
        >
          <div className="relative h-56 overflow-hidden">
            <img
              src={
                vehicle.image ||
                "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200"
              }
              alt={vehicle.name}
              className="h-full w-full object-cover transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-sky-700 shadow-lg backdrop-blur-sm">
              <Key className="h-3.5 w-3.5" />
              {vehicle.transmission}
            </div>
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              <BadgeCheck className="h-3.5 w-3.5" />
              {vehicle.type}
              <span className="text-white/60">•</span>
              {vehicle.seats} seats
            </div>
          </div>
          <div className="space-y-4 p-6">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950">{vehicle.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">{vehicle.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {vehicle.features?.slice(0, 3).map((feature: string, idx: number) => (
                <span
                  key={idx}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {feature}
                </span>
              ))}
              {vehicle.features?.length > 3 && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-400">
                  +{vehicle.features.length - 3} more
                </span>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">Price Daily</div>
                <div className={`mt-1 text-2xl font-black ${accent.text}`}>${vehicle.pricePerDay}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditVehicle(vehicle)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  title="Edit Vehicle"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteVehicle(vehicle._id)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                  title="Delete Vehicle"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
