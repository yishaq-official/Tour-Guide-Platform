import { Link } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import type { RetrievedSource } from "../types/ai.types";

interface SourceCitationCardProps {
  sources: RetrievedSource[];
  onSelect: () => void;
}

export function SourceCitationCard({ sources, onSelect }: SourceCitationCardProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-2">
        📚 Retrieved RAG Sources
      </span>
      <div className="space-y-2">
        {sources.map((source) => (
          <Link
            key={source.id}
            to={source.link}
            onClick={onSelect}
            className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors border border-emerald-100 group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-gray-900 truncate">{source.name}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
