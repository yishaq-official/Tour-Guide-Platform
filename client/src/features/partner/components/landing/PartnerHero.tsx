import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Percent,
  Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TabContent {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  image: string;
  ctaText: string;
  ctaLink: string;
  bullets: readonly string[];
  benefits: readonly string[];
}

interface PartnerHeroProps {
  activeTabContent: TabContent;
}

const trustPoints = [
  {
    icon: TrendingUp,
    title: "Grow visibility",
    text: "Get found by travelers already planning a trip.",
  },
  {
    icon: ShieldCheck,
    title: "Stay in control",
    text: "Manage listings and reservations in one place.",
  },
  {
    icon: Sparkles,
    title: "Look polished",
    text: "A cleaner page makes your business feel premium.",
  },
];

const pricingHighlights = [
  { icon: DollarSign, title: "Setup", value: "$0", text: "No upfront cost." },
  { icon: Percent, title: "Commission", value: "5%", text: "Only on confirmed bookings." },
  { icon: Calendar, title: "Edits", value: "Live", text: "Update listings anytime." },
];

export function PartnerHero({ activeTabContent }: PartnerHeroProps) {
  const ActiveIcon = activeTabContent.icon;

  return (
    <section className="relative overflow-hidden border-b border-gray-100 bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_24%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-green-700">
            <Sparkles className="h-3.5 w-3.5" />
            Partner portal
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            A cleaner home for your travel business.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            TravelAssist helps hotels, car partners, and tour operators present their services
            beautifully and manage bookings with less friction.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup?role=hotel"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/10 transition hover:bg-green-700"
            >
              Become a Partner
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Partner Sign In
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {trustPoints.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-green-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-sm font-bold text-gray-900">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="relative z-10"
        >
          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-2xl">
            <img
              src={activeTabContent.image}
              alt={activeTabContent.title}
              className="h-[320px] w-full object-cover"
            />
            <div className="space-y-5 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.26em] text-gray-400">
                    Featured workspace
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                      <ActiveIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">{activeTabContent.title}</h2>
                      <p className="text-sm text-gray-500">{activeTabContent.subtitle}</p>
                    </div>
                  </div>
                </div>
                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-green-700">
                  Live
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeTabContent.bullets.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {pricingHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">
                        {item.title}
                      </div>
                      <div className="mt-1 text-2xl font-black text-gray-900">{item.value}</div>
                      <p className="mt-1 text-sm text-gray-600">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
