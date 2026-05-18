"use client";

import { Product } from "./ChatInterface";
import { generateAffiliateLink } from "@/lib/affiliate";
import { trackProductClick } from "@/lib/analytics";
import { useState } from "react";

/**
 * Props for ProductCard component
 */
interface ProductCardProps {
  /** Product data to display */
  product: Product;
  /** Index for animation delay */
  index?: number;
}

/**
 * ProductCard component displays a product with image, details, and affiliate link
 * Includes hover effects, animations, and responsive design
 * 
 * @param product - Product data to display
 * @param index - Index for staggered animation
 */
export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const affiliateLink = generateAffiliateLink({
    title: product.title,
    iherb_url: product.iherb_url,
  });
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] group touch-manipulation flex flex-col"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Image - Centered, same width as button */}
      {product.image && !imageError ? (
        <div className="h-28 sm:h-36 bg-gray-100 mt-3 sm:mt-4 mx-4 sm:mx-5 rounded-lg overflow-hidden w-[calc(100%-2rem)] sm:w-[calc(100%-2.5rem)]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-28 sm:h-36 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 flex items-center justify-center mt-3 sm:mt-4 mx-4 sm:mx-5 rounded-lg w-[calc(100%-2rem)] sm:w-[calc(100%-2.5rem)]">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600"
          >
            <path
              d="M12 2C8 2 4 4 4 8C4 12 8 16 12 18C16 16 20 12 20 8C20 4 16 2 12 2Z"
              fill="currentColor"
              className="opacity-90"
            />
            <path
              d="M12 18L12 22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="opacity-70"
            />
          </svg>
        </div>
      )}

      {/* Content - Padding area */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Category and Price - Top row */}
        <div className="flex items-center justify-between mb-1.5 gap-4">
          <span className="inline-block px-2 py-1 text-[11px] font-medium text-green-700 bg-green-100 rounded-full leading-tight">
            {product.category}
          </span>
          <span className="text-xl sm:text-2xl font-bold text-green-600">
            {product.price}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-1.5 text-base sm:text-lg leading-tight group-hover:text-green-700 transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* CTA Button - Full width at bottom */}
        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackProductClick(product.id, product.title, affiliateLink)}
          className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 touch-manipulation text-center"
        >
          View on iHerb →
        </a>
      </div>
    </div>
  );
}
