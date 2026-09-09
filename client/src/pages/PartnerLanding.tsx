import { useState } from "react";
import { Building, Car, Compass } from "lucide-react";
import { PartnerNavbar } from "../components/layout/PartnerNavbar";
import { PartnerHero } from "../features/partner/components/landing/PartnerHero";
import {
  PartnerBenefits,
  type PartnerTab,
  type TabContent,
} from "../features/partner/components/landing/PartnerBenefits";
import { PartnerPricing } from "../features/partner/components/landing/PartnerPricing";
import { PartnerFAQ } from "../features/partner/components/landing/PartnerFAQ";

const tabsContent: Record<PartnerTab, TabContent> = {
  hotel: {
    title: "Hotels",
    subtitle: "Show rooms, rates, and location clearly.",
    icon: Building,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600",
    ctaText: "List My Hotel",
    ctaLink: "/signup?role=hotel",
    bullets: ["Room types", "Map pin", "Reservation control"],
    benefits: ["Clean property pages", "Room setup made simple", "Fast booking updates"],
  },
  car: {
    title: "Car Rentals",
    subtitle: "Present your fleet with confidence.",
    icon: Car,
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
    ctaText: "List My Fleet",
    ctaLink: "/signup?role=car",
    bullets: ["Daily pricing", "Vehicle details", "Booking actions"],
    benefits: ["Trusted vehicle cards", "Clear policies", "Quick confirm/cancel actions"],
  },
  agency: {
    title: "Tour Agencies",
    subtitle: "Built for future tour listings.",
    icon: Compass,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1600",
    ctaText: "Register Interest",
    ctaLink: "/signup?role=hotel",
    bullets: ["Itineraries", "Group pricing", "Early access"],
    benefits: ["Coming soon workspace", "Trip discovery ready", "Early partner onboarding"],
  },
};

export function PartnerLanding() {
  const [activeTab, setActiveTab] = useState<PartnerTab>("hotel");
  const active = tabsContent[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <PartnerNavbar />

      <main>
        <PartnerHero activeTabContent={active} />
        <PartnerBenefits
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeContent={active}
        />
        <PartnerPricing />
        <PartnerFAQ />
      </main>
    </div>
  );
}
