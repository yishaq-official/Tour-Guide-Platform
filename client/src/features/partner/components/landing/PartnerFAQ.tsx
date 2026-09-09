import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Clock3, ArrowRight } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "Is it free to join?",
    answer: "Yes. There is no setup fee or monthly fee.",
  },
  {
    question: "What is the commission?",
    answer: "TravelAssist uses a flat 5% commission on confirmed bookings.",
  },
  {
    question: "Can I edit listings later?",
    answer: "Yes. You can update prices, photos, and availability anytime.",
  },
  {
    question: "How do I access the dashboard?",
    answer: "Create a partner account, then sign in to open your dashboard.",
  },
];

export function PartnerFAQ({ faqs = defaultFAQs }: { faqs?: FAQItem[] }) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <>
      <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-gray-500 shadow-sm">
            <HelpCircle className="h-3.5 w-3.5 text-green-600" />
            FAQ
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Quick answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFAQ === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFAQ(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
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
                Simple onboarding, polished presentation, and a dashboard that makes your travel
                business easier to book.
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
    </>
  );
}
