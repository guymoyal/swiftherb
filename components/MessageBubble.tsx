"use client";

import { Message, Product } from "./ChatInterface";
import ProductCard from "./ProductCard";
import QuickActions from "./QuickActions";

interface MessageBubbleProps {
  message: Message;
  onQuickAction?: (action: string) => void;
  onCompare?: (products: Product[] | undefined) => void;
}

/**
 * MessageBubble component displays chat messages with product cards
 * Supports user and assistant messages with product recommendations
 * 
 * @param message - The message object containing content and products
 * @param onQuickAction - Callback function for quick action buttons
 */
export default function MessageBubble({ message, onQuickAction, onCompare }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Parse product names from double brackets [[Product Name]] and replace with styled spans
  const productMatches = message.content.match(/\[\[([^\]]+)\]\]/g) || [];
  const productNames = productMatches.map((match) =>
    match.replace(/\[\[|\]\]/g, "")
  );

  // Replace [[Product Name]] with styled spans in the content
  let formattedContent = message.content;
  productMatches.forEach((match) => {
    const productName = match.replace(/\[\[|\]\]/g, "");
    formattedContent = formattedContent.replace(
      match,
      `<span class="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">${productName}</span>`
    );
  });

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
    >
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-green-600 text-white shadow-md"
              : "bg-white text-gray-800 border border-gray-200 shadow-sm"
          }`}
        >
          <p
            className="whitespace-pre-wrap leading-relaxed text-[15px]"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </div>
        
        {/* Quick action buttons for assistant messages */}
        {!isUser && onQuickAction && (
          <QuickActions 
            message={message} 
            onAction={onQuickAction}
            onCompare={onCompare}
          />
        )}
        
        {/* Product cards */}
        {!isUser && message.products && message.products.length > 0 && (
          <div className="mt-5 space-y-3">
            <div className="text-sm font-semibold text-gray-700 mb-3 px-1">
              Recommended Products ({message.products.length})
            </div>
            <div className="grid grid-cols-1 gap-3">
              {message.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
