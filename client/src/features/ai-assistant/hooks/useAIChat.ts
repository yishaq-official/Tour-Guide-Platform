import { useState, useRef, useEffect } from "react";
import { API_URL } from "../../../config";
import type { Message } from "../types/ai.types";

export const STARTER_PROMPTS = [
  "🏰 History of Lalibela churches & nearby hotels",
  "👑 Best places to visit in Gondar",
  "☕ Tell me about Ethiopian coffee culture",
  "✈️ How to travel to Simien Mountains?",
];

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  sender: "ai",
  text: "👋 **Selam! I am your AI Travel Assistant.**\n\nAsk me anything about Ethiopian history, heritage sites, cultural events, or nearby hotels and car rentals!",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  suggestedPrompts: STARTER_PROMPTS,
};

export function useAIChat(isOpen: boolean) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      sender: "user",
      text: activeQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setQuery("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/rag/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery }),
      });

      if (!res.ok) throw new Error("RAG Query failed");

      const data = await res.json();

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.answer,
        retrievedSources: data.retrievedSources,
        recommendedServices: data.recommendedServices,
        suggestedPrompts: data.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "I am having trouble accessing the knowledge database right now. Please check your connection and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return {
    query,
    setQuery,
    loading,
    messages,
    messagesEndRef,
    handleSendQuery,
    clearChat,
  };
}
