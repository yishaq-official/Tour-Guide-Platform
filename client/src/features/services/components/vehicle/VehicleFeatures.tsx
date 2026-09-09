import { CheckCircle2, Fuel, MapPin, ShieldCheck } from "lucide-react";

interface VehicleFeaturesProps {
  features?: string[];
}

export function VehicleFeatures({ features }: VehicleFeaturesProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features &&
          features.map((feature, idx) => {
            let Icon = CheckCircle2;
            const lower = feature.toLowerCase();
            if (lower.includes("air")) Icon = Fuel;
            if (lower.includes("gps") || lower.includes("nav")) Icon = MapPin;
            if (lower.includes("4wd") || lower.includes("4x4")) Icon = ShieldCheck;

            return (
              <div
                key={idx}
                className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100"
              >
                <Icon className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                <span className="font-medium text-sm">{feature}</span>
              </div>
            );
          })}
      </div>
    </section>
  );
}
