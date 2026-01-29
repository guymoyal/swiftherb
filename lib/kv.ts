import { Product } from "@/components/ChatInterface";
import { findProductsByName, getProductBySlug } from "./products";
import {
  getProductFromWorkers,
  getProductsFromWorkers,
} from "./workers-api";

/**
 * Fetches product metadata from Cloudflare KV via Workers API
 * Falls back to mock data in development if Workers API is unavailable
 * 
 * @param productSlug - Product slug (e.g., "magnesium_glycinate")
 * @returns Product metadata or null if not found
 */
export async function getProductFromKV(
  productSlug: string
): Promise<Product | null> {
  // Remove "prod_" prefix if present
  const slug = productSlug.replace(/^prod_/, "");

  // Try Workers API first (production)
  if (process.env.NEXT_PUBLIC_WORKERS_API_URL || process.env.WORKERS_API_URL) {
    try {
      const product = await getProductFromWorkers(slug);
      if (product) {
        return product;
      }
    } catch (error) {
      console.warn("Workers API unavailable, falling back to mock data:", error);
    }
  }

  // Fallback to mock product database (development)
  return getProductBySlug(slug);
}

/**
 * Fetches multiple products from KV by their names
 * Converts product names to slugs and queries Workers API
 * Falls back to mock data in development
 * 
 * @param productNames - Array of product names
 * @returns Array of products found in KV
 */
export async function getProductsFromKV(
  productNames: string[]
): Promise<Product[]> {
  if (productNames.length === 0) {
    return [];
  }

  // Convert product names to slugs
  const slugs = productNames.map((name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
  );

  // Try Workers API first (production)
  if (process.env.NEXT_PUBLIC_WORKERS_API_URL || process.env.WORKERS_API_URL) {
    try {
      const products = await getProductsFromWorkers(slugs);
      if (products.length > 0) {
        return products;
      }
    } catch (error) {
      console.warn("Workers API unavailable, falling back to mock data:", error);
    }
  }

  // Fallback to mock product database (development)
  return findProductsByName(productNames);
}
