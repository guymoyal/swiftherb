"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "./ChatInterface";
import { MOCK_PRODUCTS } from "@/lib/products";

/**
 * Best Sellers component - displays featured products
 * Uses mock products for now, will fetch from API when available
 */
// Pre-compute best sellers to avoid hydration issues
const bestSellerSlugs = [
  "magnesium_glycinate",
  "vitamin_d3",
  "omega_3_fish_oil",
  "ashwagandha",
  "probiotics",
  "l_theanine",
  "rhodiola_rosea",
  "b_complex_vitamins",
  "melatonin",
  "turmeric_curcumin",
  "zinc",
  "vitamin_c",
  "iron",
  "coenzyme_q10",
  "vitamin_e",
  "calcium",
  "ginkgo_biloba",
  "glucosamine_chondroitin",
];

const getBestSellers = (): Product[] => {
  return bestSellerSlugs
    .map((slug) => {
      const product = MOCK_PRODUCTS[slug];
      if (product) {
        return {
          ...product,
          iherb_url: `https://www.iherb.com/search?kw=${encodeURIComponent(product.title)}`,
        } as Product;
      }
      return null;
    })
    .filter((p): p is Product => p !== null);
};

type BestSellersProps = {
  compact?: boolean;
};

export default function BestSellers({ compact = false }: BestSellersProps) {
  const [products] = useState<Product[]>(() => getBestSellers());
  const [visibleCount, setVisibleCount] = useState(compact ? 4 : 8);
  const productsToShow = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  // TODO: Fetch from Workers API when available
  // useEffect(() => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_WORKERS_API_URL}/products/best-sellers`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setProducts(data);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch best sellers:", error);
  //   }
  // }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className={`bg-white border-t border-gray-200 ${compact ? "py-8 sm:py-10" : "py-12 bg-gradient-to-b from-white to-gray-50"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={compact ? "mb-6" : "text-center mb-10"}>
          <h2
            className={`font-bold text-gray-900 ${compact ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl mb-3"}`}
          >
            Products people keep opening
          </h2>
          {!compact && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Photos come straight from iHerb. Tap a card, read the real listing, then decide.
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {productsToShow.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 8, products.length))}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Show More ({products.length - visibleCount} more available)
            </button>
          </div>
        )}

        {!compact && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Chat with our AI assistant to find more personalized recommendations
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
