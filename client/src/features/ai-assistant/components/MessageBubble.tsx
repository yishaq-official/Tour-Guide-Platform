import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { Message } from "../types/ai.types";
import { SourceCitationCard } from "./SourceCitationCard";
import { RecommendedServiceCard } from "./RecommendedServiceCard";

interface MessageBubbleProps {
  message: Message;
  onSelectPrompt: (prompt: string) => void;
  onCloseDrawer: () => void;
}

export function MessageBubble({ message, onSelectPrompt, onCloseDrawer }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md text-xs mt-1 font-bold">
          AI
        </div>
      )}

      <div
        className={`max-w-[85%] ${
          isUser
            ? "bg-emerald-600 text-white rounded-2xl rounded-tr-none"
            : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm"
        } p-4`}
      >
        <div
          className="text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none font-medium"
          dangerouslySetInnerHTML={{
            __html: message.text
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br />"),
          }}
        />

        {/* Retrieved Knowledge Sources */}
        {message.retrievedSources && (
          <SourceCitationCard sources={message.retrievedSources} onSelect={onCloseDrawer} />
        )}

        {/* Recommended Hotels */}
        {message.recommendedServices?.hotels && (
          <RecommendedServiceCard
            hotels={message.recommendedServices.hotels}
            onSelect={onCloseDrawer}
          />
        )}

        {/* Suggested Follow-up Prompts */}
        {message.suggestedPrompts && message.suggestedPrompts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 pt-2">
            {message.suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSelectPrompt(prompt)}
                className="text-[11px] font-semibold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 px-3 py-1.5 rounded-full transition-colors text-left border border-gray-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <span
          className={`text-[10px] block mt-2 text-right ${
            isUser ? "text-emerald-200" : "text-gray-400"
          }`}
        >
          {message.timestamp}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 shadow-md text-xs mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}
