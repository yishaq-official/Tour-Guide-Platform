import { Link } from "react-router-dom";
import { MapPin, Car, Sparkles } from "lucide-react";
import { MapWidget } from "../../../components/MapWidget";
import { WeatherWidget } from "../../../components/WeatherWidget";

interface HeritageSidebarProps {
  name: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export function HeritageSidebar({ name, location, coordinates }: HeritageSidebarProps) {
  const lat = coordinates?.lat || 9.03;
  const lng = coordinates?.lng || 38.74;

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-8">
        {/* Location Map */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
          <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
            <h3 className="text-xl font-bold">Interactive Map</h3>
            <MapPin className="w-5 h-5 text-green-400" />
          </div>
          <div className="h-64 w-full">
            <MapWidget lat={lat} lng={lng} name={name} />
          </div>
          <div className="p-6 bg-gray-50">
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              <strong>Location:</strong> {location}
            </p>
            <div className="flex items-start text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-200">
              <Car className="w-6 h-6 mr-3 text-green-600 shrink-0" />
              <span className="leading-relaxed">
                This site is accessible via domestic flights (Ethiopian Airlines) or organized overland
                tours departing from Addis Ababa.
              </span>
            </div>
          </div>
        </div>

        {/* RAG AI Assistant Card */}
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 text-white rounded-3xl p-6 shadow-xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Ask AI RAG Assistant</h3>
              <p className="text-xs text-emerald-300">Contextual query for {name}</p>
            </div>
          </div>
          <p className="text-xs text-gray-300 mb-4 leading-relaxed">
            Get instant historical answers, hotel recommendations, and transportation advice for
            visiting {name}.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md gap-2"
          >
            <span>Book Nearby Stays & Vehicles</span>
          </Link>
        </div>

        {/* Weather Widget */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Current Weather</h3>
          <WeatherWidget lat={lat} lng={lng} />
        </div>
      </div>
    </div>
  );
}
