/**
 * Client for Cloudflare Workers API
 * Handles communication with the Workers backend for KV access
 */

import { Product } from "@/components/ChatInterface";

const WORKERS_API_URL =
  process.env.NEXT_PUBLIC_WORKERS_API_URL ||
  process.env.WORKERS_API_URL ||
  "http://localhost:8787";

/**
 * KV Product structure (matches Workers API)
 */
interface KVProduct {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  category: string;
  slug: string;
  iherb_url?: string;
}

/**
 * Convert KV product to app Product format
 */
function kvToProduct(kvProduct: KVProduct): Product {
  return {
    id: kvProduct.id,
    title: kvProduct.title,
    price: kvProduct.price,
    image: kvProduct.image,
    description: kvProduct.description,
    category: kvProduct.category,
  };
}

/**
 * Get a single product by slug from Workers API
 */
export async function getProductFromWorkers(
  slug: string
): Promise<Product | null> {
  try {
    const response = await fetch(`${WORKERS_API_URL}/products/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Workers API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data) {
      return kvToProduct(data.data);
    }

    return null;
  } catch (error) {
    console.error("Error fetching product from Workers:", error);
    // Fallback to mock data in development
    if (process.env.NODE_ENV === "development") {
      const { getProductBySlug } = await import("./products");
      return getProductBySlug(slug);
    }
    throw error;
  }
}

/**
 * Get multiple products by slugs (batch request)
 */
export async function getProductsFromWorkers(
  slugs: string[]
): Promise<Product[]> {
  if (slugs.length === 0) {
    return [];
  }

  try {
    const response = await fetch(`${WORKERS_API_URL}/products/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slugs }),
    });

    if (!response.ok) {
      throw new Error(`Workers API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data) {
      return data.data.map(kvToProduct);
    }

    return [];
  } catch (error) {
    console.error("Error fetching products from Workers:", error);
    // Fallback to mock data in development
    if (process.env.NODE_ENV === "development") {
      const { findProductsByName } = await import("./products");
      // Convert slugs to product names for mock lookup
      const productNames = slugs.map((slug) =>
        slug.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      );
      return findProductsByName(productNames);
    }
    return [];
  }
}

/**
 * Search products (placeholder - requires index in production)
 */
export async function searchProductsFromWorkers(
  query: string
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${WORKERS_API_URL}/products/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Workers API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data) {
      return data.data.map(kvToProduct);
    }

    return [];
  } catch (error) {
    console.error("Error searching products from Workers:", error);
    return [];
  }
}

/**
 * Health check for Workers API
 */
export async function checkWorkersHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${WORKERS_API_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}
