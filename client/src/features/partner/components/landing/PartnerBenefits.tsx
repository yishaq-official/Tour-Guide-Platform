import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building, Car, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PartnerTab = "hotel" | "car" | "agency";

export interface TabContent {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  image: string;
  ctaText: string;
  ctaLink: string;
  bullets: readonly string[];
  benefits: readonly string[];
}

interface PartnerBenefitsProps {
  activeTab: PartnerTab;
  onTabChange: (tab: PartnerTab) => void;
  activeContent: TabContent;
}

export function PartnerBenefits({
  activeTab,
  onTabChange,
  activeContent,
}: PartnerBenefitsProps) {
  const ActiveIcon = activeContent.icon;

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-gray-500 shadow-sm">
          <Compass className="h-3.5 w-3.5 text-green-600" />
          Partner options
        </div>
        <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Choose the partner type that fits you
        </h2>
      </div>

      <div className="mx-auto mb-8 flex max-w-xl flex-wrap justify-center gap-3">
        {(["hotel", "car", "agency"] as PartnerTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === "hotel" ? "Hotels" : tab === "car" ? "Cars" : "Agencies";
          const Icon = tab === "hotel" ? Building : tab === "car" ? Car : Compass;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                isActive
                  ? "border-green-600 bg-green-600 text-white shadow-md shadow-green-600/10"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm lg:grid lg:grid-cols-2"
      >
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <ActiveIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">{activeContent.title}</h3>
              <p className="text-sm text-gray-500">{activeContent.subtitle}</p>
            </div>
          </div>

          <ul className="mt-8 space-y-4">
            {activeContent.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm leading-7 text-gray-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              to={activeContent.ctaLink}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black"
            >
              {activeContent.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[360px]">
          <img
            src={activeContent.image}
            alt={activeContent.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/55 via-gray-950/10 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-gray-700 shadow-sm backdrop-blur">
            {activeContent.subtitle}
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
            {activeContent.bullets.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
