import { DollarSign, ClipboardList, Clock, CheckCircle2 } from "lucide-react";

interface PartnerMetricsCardsProps {
  bookings: any[];
  accent: {
    bg: string;
    text: string;
    chip: string;
  };
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function PartnerMetricsCards({ bookings, accent }: PartnerMetricsCardsProps) {
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length;
  const totalEarnings = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const metrics = [
    {
      label: "Confirmed earnings",
      value: formatMoney(totalEarnings),
      hint: "Revenue locked by confirmed bookings",
      icon: DollarSign,
      chip: accent.bg,
      chipText: accent.text,
    },
    {
      label: "Total bookings",
      value: String(totalBookings),
      hint: "All incoming reservation requests",
      icon: ClipboardList,
      chip: "bg-white",
      chipText: "text-slate-700",
    },
    {
      label: "Pending approval",
      value: String(pendingBookings),
      hint: "Action needed to confirm guests",
      icon: Clock,
      chip: "bg-amber-50",
      chipText: "text-amber-700",
    },
    {
      label: "Confirmed trips",
      value: String(confirmedBookings),
      hint: "Travelers ready for arrival",
      icon: CheckCircle2,
      chip: "bg-emerald-50",
      chipText: "text-emerald-700",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {metrics.map((metric, i) => (
        <div
          key={i}
          className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {metric.label}
            </span>
            <div className={`p-2.5 rounded-xl ${metric.chip} ${metric.chipText}`}>
              <metric.icon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{metric.value}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">{metric.hint}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
