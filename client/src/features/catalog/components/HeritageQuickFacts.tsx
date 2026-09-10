import { motion } from "framer-motion";
import { Info, Sparkles, Calendar, Landmark, Globe, Award } from "lucide-react";

interface HeritageQuickFactsProps {
  quickFacts?: Record<string, string>;
}

export function HeritageQuickFacts({ quickFacts }: HeritageQuickFactsProps) {
  if (!quickFacts || Object.keys(quickFacts).length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-sm"
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mr-3 shadow-md">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Key Facts & Details</h2>
          <p className="text-xs text-gray-500 font-medium">
            Essential technical and historical information at a glance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(quickFacts).map(([key, value]) => {
          const keyLower = key.toLowerCase();
          let IconComponent = Sparkles;

          if (
            keyLower.includes("era") ||
            keyLower.includes("built") ||
            keyLower.includes("date") ||
            keyLower.includes("period") ||
            keyLower.includes("century") ||
            keyLower.includes("year")
          ) {
            IconComponent = Calendar;
          } else if (
            keyLower.includes("architect") ||
            keyLower.includes("structure") ||
            keyLower.includes("style") ||
            keyLower.includes("design") ||
            keyLower.includes("type") ||
            keyLower.includes("material")
          ) {
            IconComponent = Landmark;
          } else if (
            keyLower.includes("region") ||
            keyLower.includes("location") ||
            keyLower.includes("city") ||
            keyLower.includes("place") ||
            keyLower.includes("altitude")
          ) {
            IconComponent = Globe;
          } else if (
            keyLower.includes("significan") ||
            keyLower.includes("status") ||
            keyLower.includes("unesco") ||
            keyLower.includes("importance")
          ) {
            IconComponent = Award;
          }

          return (
            <div
              key={key}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-150 flex items-start gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 shadow-inner">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1">
                  {key}
                </h4>
                <p
                  className="text-gray-800 text-xs sm:text-sm font-semibold leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: value
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\*/g, ""),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
