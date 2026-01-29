"use client";

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ProductComparison from "./ProductComparison";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

export interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

const STORAGE_KEY = "swiftherb_chat_history";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<Product[] | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Only restore if messages exist and are recent (within 7 days)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMessage: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        products: data.products,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const { handleError } = await import("@/lib/error-handler");
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: handleError(error, { action: "send_message" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      {/* Centered container like Gemini */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 && (
            <div className="text-center mt-16 mb-12 animate-fadeIn">
              <h2 className="text-4xl font-semibold mb-3 text-gray-900">
                {messages.length > 0 ? "Continue the conversation" : "How can I help you today?"}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ask me about supplements, vitamins, or health concerns.
              </p>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                  {[
                    "Help with anxiety",
                    "Improve sleep quality",
                    "Boost energy levels",
                    "Support immune system",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:border-green-500 hover:bg-green-50 transition-colors text-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              {messages.length > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      if (confirm("Clear chat history? This cannot be undone.")) {
                        setMessages([]);
                        localStorage.removeItem(STORAGE_KEY);
                      }
                    }}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear chat history
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="space-y-6 pb-8">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                onQuickAction={handleSendMessage}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
