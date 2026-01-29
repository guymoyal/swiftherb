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
      label: "Compare products",
      action: "compare",
      icon: "⚖️",
      onClick: () => onCompare && onCompare(message.products),
    },
  ];

  return (
    <div className="mt-3 flex flex-wrap gap-2 px-1">
      {actions.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors flex items-center gap-1.5 border border-gray-200 hover:border-gray-300"
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
