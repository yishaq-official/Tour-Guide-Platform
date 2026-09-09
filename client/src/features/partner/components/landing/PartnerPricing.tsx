import { Percent, DollarSign, Calendar } from "lucide-react";

export function PartnerPricing() {
  const items = [
    { icon: DollarSign, title: "Setup", value: "$0", text: "No registration fee." },
    { icon: Percent, title: "Commission", value: "5%", text: "Only on confirmed bookings." },
    { icon: Calendar, title: "Management", value: "Live", text: "Edit listings anytime." },
  ];

  return (
    <section id="pricing" className="border-y border-gray-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-gray-500">
            <Percent className="h-3.5 w-3.5 text-green-600" />
            Simple pricing
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Clear terms, no clutter
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-green-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">
                  {item.title}
                </div>
                <div className="mt-2 text-4xl font-black tracking-tight text-gray-900">{item.value}</div>
                <p className="mt-2 text-sm leading-7 text-gray-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
