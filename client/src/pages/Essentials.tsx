import { TelecomSection } from "../features/essentials/components/TelecomSection";
import { MobileMoneySection } from "../features/essentials/components/MobileMoneySection";
import { RideHailingSection } from "../features/essentials/components/RideHailingSection";
import { PowerStandardsSection } from "../features/essentials/components/PowerStandardsSection";
import { AmharicPhrasebook } from "../features/essentials/components/AmharicPhrasebook";
import { QuickReferenceCards } from "../features/essentials/components/QuickReferenceCards";

export function Essentials() {
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Ethiopia Tourist Essentials
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your complete guide to mobile networks, digital wallets, ride-hailing apps, power standards, visas, and interactive Amharic phrasebook.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 space-y-12">
        {/* 1. Telecom & SIM Cards */}
        <TelecomSection />

        {/* 2. Mobile Money & Digital Wallets */}
        <MobileMoneySection />

        {/* 3. Local Ride-Hailing Apps */}
        <RideHailingSection />

        {/* 4. Power Standards & Voltage */}
        <PowerStandardsSection />

        {/* 5. Interactive Amharic Phrasebook & Etiquette */}
        <AmharicPhrasebook />

        {/* 6. Banking, Visa & Emergency Quick Reference */}
        <QuickReferenceCards />
      </div>
    </div>
  );
}
