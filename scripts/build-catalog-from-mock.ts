/**
 * Builds data/catalog/products.json from lib/products.ts MOCK_PRODUCTS.
 * Adds iHerb search links where product URL is missing.
 *
 * Run: pnpm exec tsx scripts/build-catalog-from-mock.ts
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MOCK_PRODUCTS } from "../lib/products";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CATEGORY_TO_SLUG: Record<string, string> = {
  Minerals: "minerals",
  Vitamins: "vitamins",
  "Herbs & Botanicals": "herbs",
  "Omega-3 & Essential Fatty Acids": "omega-probiotics",
  Probiotics: "digestive",
  "Amino Acids": "sports",
  "Sleep Support": "sleep-mood",
  "Mood Support": "sleep-mood",
  Antioxidants: "immune",
  "Joint Support": "joint-bone",
  "Beauty & Skin": "beauty-collagen",
  "Men's Health": "vitamins",
  "Women's Health": "vitamins",
  "Sports Nutrition": "sports",
  "Digestive Health": "digestive",
  "Respiratory Support": "immune",
  "Immune Support": "immune",
};

function categorySlugFor(category: string): string {
  return CATEGORY_TO_SLUG[category] || "vitamins";
}

const products = Object.entries(MOCK_PRODUCTS).map(([slug, p]) => {
  const categorySlug = categorySlugFor(p.category);
  return {
    slug,
    categorySlug,
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.image,
    description: p.description,
    category: p.category,
    iherb_url:
      p.iherb_url ||
      `https://www.iherb.com/search?kw=${encodeURIComponent(p.title)}`,
  };
});

const out = join(__dirname, "../data/catalog/products.json");
writeFileSync(out, JSON.stringify(products, null, 2));
console.log(`Wrote ${products.length} products to ${out}`);
