import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { TouristHighlight } from "../types/catalog.types";

interface HeritageHighlightsProps {
  touristHighlights?: TouristHighlight[];
  travelerExperience?: string[];
}

export function HeritageHighlights({
  touristHighlights,
  travelerExperience,
}: HeritageHighlightsProps) {
  return (
    <>
      {/* Tourist Highlights */}
      {touristHighlights && touristHighlights.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Highlights</h2>
          <div className="grid grid-cols-1 gap-6">
            {touristHighlights.map((highlight, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 group"
              >
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors"
                  dangerouslySetInnerHTML={{
                    __html: highlight.title
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\*/g, ""),
                  }}
                />
                <p
                  className="text-gray-600 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlight.description
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\*/g, ""),
                  }}
                />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Traveler Experience */}
      {travelerExperience && travelerExperience.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What Travelers Experience</h2>
          <ul className="space-y-4">
            {travelerExperience.map((exp, idx) => {
              const [title, ...rest] = exp.split(": ");
              const desc = rest.join(": ");
              return (
                <li key={idx} className="flex items-start bg-gray-50 p-6 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mr-4 shrink-0 mt-1" />
                  <div>
                    <strong className="text-xl text-gray-900 block mb-2">{title}</strong>
                    <span className="text-gray-600 text-lg leading-relaxed">{desc || exp}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.section>
      )}
    </>
  );
}
