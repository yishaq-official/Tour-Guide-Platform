import { motion } from "framer-motion";
import { Bot, RefreshCw, X, Send } from "lucide-react";
import type { Message } from "../types/ai.types";
import { MessageBubble } from "./MessageBubble";
import type { RefObject } from "react";

interface ChatDrawerProps {
  messages: Message[];
  query: string;
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onQueryChange: (val: string) => void;
  onSendQuery: (text?: string) => void;
  onClearChat: () => void;
  onClose: () => void;
}

export function ChatDrawer({
  messages,
  query,
  loading,
  messagesEndRef,
  onQueryChange,
  onSendQuery,
  onClearChat,
  onClose,
}: ChatDrawerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Drawer Header */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-green-950 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2">
              TravelAssist RAG AI
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-400/30">
                RAG v1.0
              </span>
            </h3>
            <p className="text-xs text-emerald-300/80 font-medium">History, Cultural Sites & Travel Concierge</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onClearChat}
            title="Clear Chat"
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onSelectPrompt={(prompt) => onSendQuery(prompt)}
            onCloseDrawer={onClose}
          />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-xl border border-gray-200 w-fit">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Searching RAG vector index & database...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendQuery();
        }}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ask about Ethiopian history, hotels, sites..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shrink-0 shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}
