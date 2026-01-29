"use client";

import { Product } from "./ChatInterface";
import { useState } from "react";
import Image from "next/image";

interface ProductComparisonProps {
  products: Product[];
  onClose: () => void;
}

/**
 * ProductComparison component displays a comparison view of selected products
 * Allows users to compare multiple products side-by-side
 * 
 * @param products - Array of products to compare
 * @param onClose - Callback to close the comparison view
 */
export default function ProductComparison({ products, onClose }: ProductComparisonProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products.slice(0, 3));

  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length < 3) {
        return [...prev, product];
      }
      return prev;
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Compare Products</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Product Selection */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">
            Select up to 3 products to compare:
          </p>
          <div className="flex flex-wrap gap-2">
            {products.map((product) => {
              const isSelected = selectedProducts.some((p) => p.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    isSelected
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {product.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedProducts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Feature</th>
                  {selectedProducts.map((product) => (
                    <th key={product.id} className="text-center p-3 font-semibold text-gray-700">
                      <div className="flex flex-col items-center gap-2">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={80}
                            height={80}
                            className="object-cover rounded-lg"
                          />
                        )}
                        <span className="text-sm max-w-[150px]">{product.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Price</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-3 text-center text-green-600 font-bold">
                      {product.price}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Category</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-3 text-center text-gray-600">
                      {product.category}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Description</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-3 text-center text-sm text-gray-600">
                      {product.description}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {selectedProducts.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Select at least one product to compare
          </p>
        )}
      </div>
    </div>
  );
}
