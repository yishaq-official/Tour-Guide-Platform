import { Landmark, Compass, Hotel, Car } from "lucide-react";

interface AdminStatsCardsProps {
  heritagesCount: number;
  culturesCount: number;
  hotelsCount: number;
  vehiclesCount: number;
}

export function AdminStatsCards({
  heritagesCount,
  culturesCount,
  hotelsCount,
  vehiclesCount,
}: AdminStatsCardsProps) {
  const stats = [
    { label: "Total Heritages", value: heritagesCount, icon: Landmark, bg: "bg-amber-500/10 text-amber-700" },
    { label: "Total Cultures", value: culturesCount, icon: Compass, bg: "bg-purple-500/10 text-purple-700" },
    { label: "Registered Hotels", value: hotelsCount, icon: Hotel, bg: "bg-emerald-500/10 text-emerald-700" },
    { label: "Registered Vehicles", value: vehiclesCount, icon: Car, bg: "bg-blue-500/10 text-blue-700" },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center justify-between"
        >
          <div>
            <span className="text-sm font-semibold text-gray-500">{stat.label}</span>
            <div className="text-3xl font-black text-gray-900 mt-1">{stat.value}</div>
          </div>
          <div className={`p-4 rounded-2xl ${stat.bg}`}>
            <stat.icon className="w-6 h-6" />
          </div>
        </div>
      ))}
    </section>
  );
}
