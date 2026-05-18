import type { Product } from "@/components/ChatInterface";
import catalogCategories from "@/data/catalog/categories.json";
import catalogProducts from "@/data/catalog/products.json";

export interface CatalogCategory {
  slug: string;
  title: string;
  description: string;
  /** iHerb category or search URL — used by the Apify sync script */
  iherbSourceUrl: string;
}

export interface CatalogProduct extends Product {
  slug: string;
  categorySlug: string;
}

const categories = catalogCategories as CatalogCategory[];
const products = catalogProducts as CatalogProduct[];

export function getCatalogCategories(): CatalogCategory[] {
  return categories;
}

export function getCatalogCategory(slug: string): CatalogCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCatalogProductsByCategory(slug: string): CatalogProduct[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function getAllCatalogProducts(): CatalogProduct[] {
  return products;
}

export function getCatalogProductCount(): number {
  return products.length;
}
