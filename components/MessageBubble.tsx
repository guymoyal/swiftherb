"use client";

import { useState } from "react";
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
  const [visibleProductCount, setVisibleProductCount] = useState(6);
  const [visibleBundleCount, setVisibleBundleCount] = useState(6);

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

  const hasProducts = !isUser && ((message.products && message.products.length > 0) || (message.bundleSuggestions && message.bundleSuggestions.length > 0));

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn mb-6`}
    >
      <div className={`w-full ${isUser ? "max-w-[85%] sm:max-w-[75%] order-2" : hasProducts ? "max-w-full order-1" : "max-w-[85%] sm:max-w-[75%] order-1"}`}>
        {/* Message text bubble - Hide if products exist (only show products and quick actions) */}
        {!hasProducts && (
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
        )}
        
        {/* Product cards - Full width when present - SHOW FIRST */}
        {!isUser && message.products && message.products.length > 0 && (
          <div className="mt-5 w-full">
            <div className="text-sm font-semibold text-gray-700 mb-4 px-1">
              Recommended Products ({message.products.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {message.products.slice(0, visibleProductCount).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            {message.products.length > visibleProductCount && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleProductCount((prev) => Math.min(prev + 6, message.products!.length))}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  Show More ({message.products.length - visibleProductCount} more available)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bundle suggestions */}
        {!isUser && message.bundleSuggestions && message.bundleSuggestions.length > 0 && (
          <div className="mt-8 w-full border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4 px-1">
              <span className="text-lg">📦</span>
              <div className="text-sm font-semibold text-gray-700">
                Complete Your Stack ({message.bundleSuggestions.length} additional products)
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-4 px-1">
              These products work synergistically with your current selections
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {message.bundleSuggestions.slice(0, visibleBundleCount).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            {message.bundleSuggestions.length > visibleBundleCount && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleBundleCount((prev) => Math.min(prev + 6, message.bundleSuggestions!.length))}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  Show More ({message.bundleSuggestions.length - visibleBundleCount} more available)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick action buttons for assistant messages - AT THE BOTTOM */}
        {!isUser && onQuickAction && message.products && message.products.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <QuickActions 
              message={message} 
              onAction={onQuickAction}
              onCompare={onCompare}
            />
          </div>
        )}
      </div>
    </div>
  );
}
