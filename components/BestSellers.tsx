"use client";

import { useState, useEffect } from "react";
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

export default function BestSellers() {
  const [products] = useState<Product[]>(() => getBestSellers());
  const [visibleCount, setVisibleCount] = useState(6);
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
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Best Sellers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular natural health products, carefully selected for quality and effectiveness
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsToShow.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 6, products.length))}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Show More ({products.length - visibleCount} more available)
            </button>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Chat with our AI assistant to find more personalized recommendations
          </p>
        </div>
      </div>
    </section>
  );
}
