"use client";

import { Message, Product } from "./ChatInterface";

interface QuickActionsProps {
  message: Message;
  onAction: (action: string) => void;
  onCompare?: (products: Product[] | undefined) => void;
}

/**
 * QuickActions component displays action buttons below assistant messages
 * Provides quick follow-up options like "Tell me more" or "Show alternatives"
 * 
 * @param message - The message to provide actions for
 * @param onAction - Callback function when an action is clicked
 * @param onCompare - Callback function to open product comparison
 */
export default function QuickActions({ message, onAction, onCompare }: QuickActionsProps) {
  // Only show actions for assistant messages with products
  if (message.role !== "assistant" || !message.products || message.products.length === 0) {
    return null;
  }

  const actions = [
    {
      label: "Tell me more",
      action: "Can you provide more details about these products?",
      icon: "💡",
      onClick: () => onAction("Can you provide more details about these products?"),
    },
    {
      label: "Show alternatives",
      action: "Are there alternative products I should consider?",
      icon: "🔄",
      onClick: () => onAction("Are there alternative products I should consider?"),
    },
    {
      label: "Complete my stack",
      action: "What other supplements should I add to complete my wellness stack?",
      icon: "📦",
      onClick: () => onAction("What other supplements should I add to complete my wellness stack?"),
    },
    {
      label: "Bundle recommendations",
      action: "Show me bundle recommendations for these products",
      icon: "🎁",
      onClick: () => onAction("Show me bundle recommendations for these products"),
    },
    {
      label: "Compare products",
      action: "compare",
      icon: "⚖️",
      onClick: () => onCompare && onCompare(message.products),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 px-1">
      {actions.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className="px-4 py-2 text-sm font-medium bg-white border border-green-200 text-gray-900 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 group"
        >
          <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
