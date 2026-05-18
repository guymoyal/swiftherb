import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import {
  getCatalogCategories,
  getCatalogCategory,
  getCatalogProductsByCategory,
} from "@/lib/catalog";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return getCatalogCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = getCatalogCategory(slug);
  if (!cat) return { title: "Category not found" };
  return {
    title: `${cat.title} | SwiftHerb Catalog`,
    description: cat.description,
  };
}

export default async function CatalogCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const cat = getCatalogCategory(slug);
  if (!cat) notFound();

  const products = getCatalogProductsByCategory(slug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-green-600">
            Catalog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{cat.title}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{cat.title}</h1>
          <p className="text-gray-600 max-w-3xl leading-relaxed">{cat.description}</p>
          <p className="mt-4 text-sm text-gray-500 max-w-3xl">
            Product names and short descriptions on this page are for discovery only. Always read
            labels and official iHerb listings—including ingredients, allergens, and reviews—before
            buying. Not medical advice.
          </p>
        </header>

        {products.length === 0 ? (
          <p className="text-gray-600">
            No products in this category yet. Run{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">pnpm catalog:build-mock</code> or
            sync from Apify per <code className="bg-gray-100 px-1 rounded">scripts/sync-catalog-apify.ts</code>.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={`${product.slug}-${product.id}`}
                product={product}
                index={index}
                directRetailerLink
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
