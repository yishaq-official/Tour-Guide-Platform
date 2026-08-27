import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, Send, Bot, User, MapPin, Building2, 
  RefreshCw, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

interface RetrievedSource {
  id: string;
  name: string;
  type: string;
  location: string;
  isUnesco: boolean;
  image: string;
  link: string;
}

interface RecommendedService {
  _id: string;
  name: string;
  location?: string;
  pricePerNight?: number;
  pricePerDay?: number;
  image?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  retrievedSources?: RetrievedSource[];
  recommendedServices?: {
    hotels?: RecommendedService[];
    vehicles?: RecommendedService[];
  };
  suggestedPrompts?: string[];
  timestamp: string;
}

const STARTER_PROMPTS = [
  "🏰 History of Lalibela churches & nearby hotels",
  "👑 Best places to visit in Gondar",
  "☕ Tell me about Ethiopian coffee culture",
  "✈️ How to travel to Simien Mountains?"
];

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 **Selam! I am your AI Travel Assistant.**\n\nAsk me anything about Ethiopian history, heritage sites, cultural events, or nearby hotels and car rentals!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: STARTER_PROMPTS,
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendQuery = async (textToSend?: string) => {
    const activeQuery = textToSend || query;
    if (!activeQuery.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: activeQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setQuery('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery }),
      });

      if (!res.ok) throw new Error('RAG Query failed');

      const data = await res.json();

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer,
        retrievedSources: data.retrievedSources,
        recommendedServices: data.recommendedServices,
        suggestedPrompts: data.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: "I am having trouble accessing the knowledge database right now. Please check your connection and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

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
                  onClick={() => setMessages([messages[0]])}
                  title="Clear Chat"
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md text-xs mt-1 font-bold">
                      AI
                    </div>
                  )}

                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-none' : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm'} p-4`}>
                    <div 
                      className="text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none font-medium"
                      dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br />')
                      }}
                    />

                    {/* Retrieved Knowledge Sources */}
                    {msg.retrievedSources && msg.retrievedSources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-2">
                          📚 Retrieved RAG Sources
                        </span>
                        <div className="space-y-2">
                          {msg.retrievedSources.map((source) => (
                            <Link
                              key={source.id}
                              to={source.link}
                              onClick={() => setIsOpen(false)}
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
                    )}

                    {/* Recommended Services */}
                    {msg.recommendedServices?.hotels && msg.recommendedServices.hotels.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-2">
                          🏨 Nearby Recommended Hotels
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.recommendedServices.hotels.map((hotel) => (
                            <Link
                              key={hotel._id}
                              to={`/services/hotel/${hotel._id}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-medium text-gray-800 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <Building2 className="w-3.5 h-3.5 text-green-600" />
                                <span>{hotel.name}</span>
                              </div>
                              {hotel.pricePerNight && (
                                <span className="font-bold text-green-700">${hotel.pricePerNight}/night</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Follow-up Prompts */}
                    {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 pt-2">
                        {msg.suggestedPrompts.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendQuery(prompt)}
                            className="text-[11px] font-semibold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 px-3 py-1.5 rounded-full transition-colors text-left border border-gray-200"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className={`text-[10px] block mt-2 text-right ${msg.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 shadow-md text-xs mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
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
              onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }}
              className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
        )}
      </AnimatePresence>
    </>
  );
}
