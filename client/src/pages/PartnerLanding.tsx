import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building,
  Car,
  Compass,
  CheckCircle2,
  Percent,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Calendar,
  ChevronDown,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Clock3,
} from 'lucide-react';
import { PartnerNavbar } from '../components/layout/PartnerNavbar';

type PartnerTab = 'hotel' | 'car' | 'agency';

interface FAQItem {
  question: string;
  answer: string;
}

const tabsContent = {
  hotel: {
    title: 'Hotels',
    subtitle: 'Show rooms, rates, and location clearly.',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'List My Hotel',
    ctaLink: '/signup?role=hotel',
    bullets: ['Room types', 'Map pin', 'Reservation control'],
    benefits: ['Clean property pages', 'Room setup made simple', 'Fast booking updates'],
  },
  car: {
    title: 'Car Rentals',
    subtitle: 'Present your fleet with confidence.',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'List My Fleet',
    ctaLink: '/signup?role=car',
    bullets: ['Daily pricing', 'Vehicle details', 'Booking actions'],
    benefits: ['Trusted vehicle cards', 'Clear policies', 'Quick confirm/cancel actions'],
  },
  agency: {
    title: 'Tour Agencies',
    subtitle: 'Built for future tour listings.',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1600',
    ctaText: 'Register Interest',
    ctaLink: '/signup?role=hotel',
    bullets: ['Itineraries', 'Group pricing', 'Early access'],
    benefits: ['Coming soon workspace', 'Trip discovery ready', 'Early partner onboarding'],
  },
} as const;

const faqs: FAQItem[] = [
  {
    question: 'Is it free to join?',
    answer: 'Yes. There is no setup fee or monthly fee.',
  },
  {
    question: 'What is the commission?',
    answer: 'TravelAssist uses a flat 5% commission on confirmed bookings.',
  },
  {
    question: 'Can I edit listings later?',
    answer: 'Yes. You can update prices, photos, and availability anytime.',
  },
  {
    question: 'How do I access the dashboard?',
    answer: 'Create a partner account, then sign in to open your dashboard.',
  },
];

export function PartnerLanding() {
  const [activeTab, setActiveTab] = useState<PartnerTab>('hotel');
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const active = tabsContent[activeTab];
  const ActiveIcon = active.icon;

  const trustPoints = [
    {
      icon: TrendingUp,
      title: 'Grow visibility',
      text: 'Get found by travelers already planning a trip.',
    },
    {
      icon: ShieldCheck,
      title: 'Stay in control',
      text: 'Manage listings and reservations in one place.',
    },
    {
      icon: Sparkles,
      title: 'Look polished',
      text: 'A cleaner page makes your business feel premium.',
    },
  ];

  const pricing = [
    { icon: DollarSign, title: 'Setup', value: '$0', text: 'No upfront cost.' },
    { icon: Percent, title: 'Commission', value: '5%', text: 'Only on confirmed bookings.' },
    { icon: Calendar, title: 'Edits', value: 'Live', text: 'Update listings anytime.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <PartnerNavbar />

      <main>
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
                TravelAssist helps hotels, car partners, and tour operators present their services beautifully and
                manage bookings with less friction.
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
                    <div key={item.title} className="rounded-3xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
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
                <img src={active.image} alt={active.title} className="h-[320px] w-full object-cover" />
                <div className="space-y-5 p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.26em] text-gray-400">Featured workspace</div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                          <ActiveIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900">{active.title}</h2>
                          <p className="text-sm text-gray-500">{active.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-green-700">
                      Live
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {active.bullets.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {pricing.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
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
            {(['hotel', 'car', 'agency'] as PartnerTab[]).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'hotel' ? 'Hotels' : tab === 'car' ? 'Cars' : 'Agencies';
              const Icon = tab === 'hotel' ? Building : tab === 'car' ? Car : Compass;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? 'border-green-600 bg-green-600 text-white shadow-md shadow-green-600/10'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
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
                  <h3 className="text-2xl font-black text-gray-900">{active.title}</h3>
                  <p className="text-sm text-gray-500">{active.subtitle}</p>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {active.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm leading-7 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to={active.ctaLink}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black"
                >
                  {active.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[360px]">
              <img src={active.image} alt={active.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/55 via-gray-900/10 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-gray-700 shadow-sm backdrop-blur">
                {active.subtitle}
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                {active.bullets.map((item) => (
                  <span key={item} className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="pricing" className="border-y border-gray-100 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-gray-500">
                <Percent className="h-3.5 w-3.5 text-green-600" />
                Simple pricing
              </div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Clear terms, no clutter</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                { icon: DollarSign, title: 'Setup', value: '$0', text: 'No registration fee.' },
                { icon: Percent, title: 'Commission', value: '5%', text: 'Only on confirmed bookings.' },
                { icon: Calendar, title: 'Management', value: 'Live', text: 'Edit listings anytime.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-6 shadow-sm">
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

        <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-gray-500 shadow-sm">
              <HelpCircle className="h-3.5 w-3.5 text-green-600" />
              FAQ
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Quick answers</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index;
              return (
                <div key={faq.question} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-gray-900">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm leading-7 text-gray-600">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gray-900 text-white shadow-2xl">
            <div className="grid lg:grid-cols-[1fr_0.9fr]">
              <div className="p-8 sm:p-10 lg:p-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/70">
                  <Clock3 className="h-3.5 w-3.5" />
                  Ready when you are
                </div>
                <h2 className="mt-5 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                  Join TravelAssist and start with a cleaner partner page.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-gray-300">
                  Simple onboarding, polished presentation, and a dashboard that makes your travel business easier to book.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/signup?role=hotel"
                    className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3.5 text-sm font-bold text-gray-950 transition hover:bg-green-400"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[280px]">
                <img
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=1600"
                  alt="Partner travel"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/25 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
