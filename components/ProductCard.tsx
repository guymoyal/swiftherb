"use client";

import { Product } from "./ChatInterface";
import { generateLink } from "@/lib/partnerize";
import { trackProductClick } from "@/lib/analytics";
import { useState } from "react";
import Image from "next/image";

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
  const affiliateLink = generateLink(product.title);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] group touch-manipulation"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {product.image && !imageError ? (
          <div className="flex-shrink-0 relative w-24 h-24 sm:w-28 sm:h-28">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 96px, 112px"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <svg
              width="32"
              height="32"
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
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full mb-2">
              {product.category}
            </span>
            <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-green-700 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-2xl font-bold text-green-600">
              {product.price}
            </span>
            <a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackProductClick(product.id, product.title, affiliateLink)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 touch-manipulation"
            >
              View on iHerb →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
