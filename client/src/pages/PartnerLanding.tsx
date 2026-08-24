import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Car, Compass, CheckCircle2, Percent, ArrowRight, ShieldCheck, DollarSign, Calendar, ChevronDown, HelpCircle } from 'lucide-react';
import { PartnerNavbar } from '../components/layout/PartnerNavbar';

type PartnerTab = 'hotel' | 'car' | 'agency';

interface FAQItem {
  question: string;
  answer: string;
}

export function PartnerLanding() {
  const [activeTab, setActiveTab] = useState<PartnerTab>('hotel');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const tabsContent = {
    hotel: {
      title: "Maximize Occupancy & Direct Bookings",
      description: "Put your hotel, guest house, or resort in front of thousands of travelers. Our tools help you manage availability, room types, and custom nightly pricing with ease.",
      icon: <Building className="w-8 h-8 text-green-700" />,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      benefits: [
        "Interactive Map Coordinates: Help guests find your precise location instantly.",
        "Custom Room Configurator: Create unlimited room variations (Deluxe, Presidential, etc.).",
        "Instant Reservation Updates: Receive and manage check-ins directly on your dashboard.",
        "0% Upfront Listing Fees: Pay only when you get a booking."
      ],
      ctaText: "List My Hotel",
      ctaLink: "/signup?role=hotel"
    },
    car: {
      title: "Expose Your Fleet to Travel Renters",
      description: "List SUVs, sedans, and minivans. Set daily rental prices, transmission types, capacity limits, and custom policies (mileage constraints, fuel returns) for travelers.",
      icon: <Car className="w-8 h-8 text-blue-700" />,
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
      benefits: [
        "Smart Fleet Catalog: Add, edit, or temporarily disable vehicles at will.",
        "Detailed Vehicle Profiles: Input transmission, fuel guidelines, and seat capacities.",
        "Secure Vehicle Booking Trackers: Confirm or cancel bookings in one click.",
        "High SUV Demand: Meet the high demand for local travel and sightseeing tours."
      ],
      ctaText: "List My Fleet",
      ctaLink: "/signup?role=car"
    },
    agency: {
      title: "Design & Sell Unique Tour Packages",
      description: "Package your local tours, excursions, and historical trips. Create itineraries, customize group rates, and reach international visitors coming to explore Ethiopia's heritages.",
      icon: <Compass className="w-8 h-8 text-purple-700" />,
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
      benefits: [
        "Tour Package Builders: Set custom itineraries, schedules, and traveler caps.",
        "Direct Booking Systems: Gain visibility on the primary 'Explore' feeds.",
        "Direct Traveler Interactions: Answer questions and update booking states easily.",
        "Coming Soon Workspace: register your interest today to get early access."
      ],
      ctaText: "Register Interest",
      ctaLink: "/signup?role=hotel"
    }
  };

  const faqs: FAQItem[] = [
    {
      question: "How do I register as a partner?",
      answer: "Click the 'Become a Partner' button in the top right, fill out your company or personal details, select your specific category (Hotel Partner or Car Rental Partner), and you'll gain access to your portal immediately."
    },
    {
      question: "Are there any listing or setup fees?",
      answer: "No, TravelAssist is completely free to join and list your services. We do not charge registration fees or monthly subscriptions. We only charge a small booking commission when a customer successfully pays."
    },
    {
      question: "What is the commission rate?",
      answer: "We charge a simple, flat 5% commission on confirmed bookings. This covers payment gateway fees, secure server hosting, and traveler marketing expenses."
    },
    {
      question: "How do payouts work?",
      answer: "Payouts are transferred directly to your bank account or mobile wallet (Telebirr/CBE Birr) upon successful completion of the traveler's booking or check-in."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col text-gray-800">
      <PartnerNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-green-50 text-green-700 border border-green-200 mb-6 uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5" /> 5% Flat Booking Commission
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
              Grow Your Travel Business in Ethiopia
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-10">
              Partner with TravelAssist to expose your hotel rooms, rental fleets, or travel agency tours to thousands of local and international travelers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/signup?role=hotel"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-600/10 text-base"
              >
                Become a Partner <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all text-base border border-gray-200/65"
              >
                Partner Sign In
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      </section>

      {/* Services Hub Tabs Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tailored Interfaces for Every Service</h2>
          <p className="text-gray-500 mt-2">Manage catalogs and track reservations in dedicated dashboards.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center border-b border-gray-200 mb-12 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('hotel')}
            className={`flex-1 pb-4 text-sm font-bold flex items-center justify-center gap-2 relative transition-all ${
              activeTab === 'hotel' ? 'text-green-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Building className="w-4 h-4" /> Hotels
            {activeTab === 'hotel' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('car')}
            className={`flex-1 pb-4 text-sm font-bold flex items-center justify-center gap-2 relative transition-all ${
              activeTab === 'car' ? 'text-green-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Car className="w-4 h-4" /> Car Rentals
            {activeTab === 'car' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('agency')}
            className={`flex-1 pb-4 text-sm font-bold flex items-center justify-center gap-2 relative transition-all ${
              activeTab === 'agency' ? 'text-green-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Compass className="w-4 h-4" /> Tour Agencies
            {activeTab === 'agency' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Detail Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Text Description */}
          <div className="p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  {tabsContent[activeTab].icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900">{tabsContent[activeTab].title}</h3>
              </div>
              <p className="text-gray-500 leading-relaxed mb-8">{tabsContent[activeTab].description}</p>
              
              <ul className="space-y-4">
                {tabsContent[activeTab].benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600 font-medium leading-tight">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <Link
                to={tabsContent[activeTab].ctaLink}
                className="inline-flex items-center px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-green-600/10"
              >
                {tabsContent[activeTab].ctaText} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Featured Image */}
          <div className="h-72 lg:h-auto min-h-[350px] relative">
            <img
              src={tabsContent[activeTab].image}
              alt={activeTab}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pricing / Commission Banner */}
      <section id="pricing" className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Transparent Pricing Model</h2>
            <p className="text-gray-500 mt-2">Zero setup or monthly fees. We only win when you win.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-green-700 border border-gray-150 mb-6 shadow-sm">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Setup Cost</h3>
                <p className="text-sm text-gray-500">Sign up and post all your hotel properties, cars, or tour packages for completely free.</p>
              </div>
              <div className="text-2xl font-black text-gray-900 mt-6">$0</div>
            </div>

            <div className="bg-green-600/5 p-8 rounded-3xl border border-green-500/10 text-center flex flex-col justify-between ring-1 ring-green-600/5">
              <div>
                <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm shadow-green-600/20">
                  <Percent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Flat 5% Commission</h3>
                <p className="text-sm text-gray-500">We charge a flat 5% commission on successfully completed bookings. No hidden additions.</p>
              </div>
              <div className="text-3xl font-black text-green-700 mt-6">5%</div>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-blue-700 border border-gray-150 mb-6 shadow-sm">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Flexible Terms</h3>
                <p className="text-sm text-gray-500">Enable or disable listings instantly at any point. No lock-in contracts or minimum stay durations.</p>
              </div>
              <div className="text-2xl font-black text-gray-900 mt-6">Flexible</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2">Find answers to commonly asked questions about partnering with TravelAssist.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFAQ === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left font-bold text-gray-900 flex justify-between items-center transition-colors hover:text-green-700"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-gray-400 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">Ready to scale your business?</h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed mb-10">
            Join the TravelAssist network today and connect with thousands of local and international visitors looking for your services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/signup?role=hotel"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-colors"
            >
              Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border border-gray-700 hover:border-gray-500 text-white font-bold rounded-2xl transition-colors"
            >
              Partner Sign In
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#04785715,transparent_35%)] pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-900 text-center text-xs font-semibold uppercase tracking-wider">
        <div className="max-w-7xl mx-auto">
          &copy; {new Date().getFullYear()} TravelAssist Partner Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
