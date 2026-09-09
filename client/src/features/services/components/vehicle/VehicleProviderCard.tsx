import { ShieldCheck, Star, PhoneCall, Info, MapPin, Fuel, Calendar } from "lucide-react";
import type { Provider, VehiclePolicies } from "../../types/service.types";

interface VehicleProviderCardProps {
  provider?: Provider;
  policies?: VehiclePolicies;
}

export function VehicleProviderCard({ provider, policies }: VehicleProviderCardProps) {
  return (
    <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-600" /> Provider Info
          </h3>
          {provider && (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="font-bold text-gray-900 text-lg mb-1">{provider.name}</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded flex items-center">
                  <Star className="w-3.5 h-3.5 mr-1 fill-current" /> {provider.rating}
                </span>
                <span className="text-xs text-gray-500 font-medium">Verified Partner</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <PhoneCall className="w-4 h-4 mr-2 text-gray-400" /> {provider.phone}
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Info className="w-5 h-5 mr-2 text-green-600" /> Rental Policies
          </h3>
          {policies && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-gray-900">Mileage</div>
                  <div className="text-sm text-gray-600">{policies.mileage}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Fuel className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-gray-900">Fuel Policy</div>
                  <div className="text-sm text-gray-600">{policies.fuel}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-gray-900">Cancellation</div>
                  <div className="text-sm text-gray-600">{policies.cancellation}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
