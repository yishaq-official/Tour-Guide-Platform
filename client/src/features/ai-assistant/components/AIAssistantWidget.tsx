import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAIChat } from "../hooks/useAIChat";
import { ChatDrawer } from "./ChatDrawer";

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    query,
    setQuery,
    loading,
    messages,
    messagesEndRef,
    handleSendQuery,
    clearChat,
  } = useAIChat(isOpen);

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400/40"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>

          <span className="hidden sm:inline font-extrabold text-sm uppercase tracking-wider pr-1">
            AI Travel Guide
          </span>
        </motion.button>
      </div>

      {/* Slide-out Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <ChatDrawer
            messages={messages}
            query={query}
            loading={loading}
            messagesEndRef={messagesEndRef}
            onQueryChange={setQuery}
            onSendQuery={handleSendQuery}
            onClearChat={clearChat}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
