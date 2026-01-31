import { getAllArticles, getAllCategories } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";

export const metadata: Metadata = {
  title: "Health & Nutrition Articles - SwiftHerb",
  description: "Evidence-based articles about supplements, vitamins, and natural health from SwiftHerb's expert health writers.",
  keywords: ["health articles", "nutrition", "supplements", "vitamins", "natural health", "wellness"],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/articles`,
    title: "Health & Nutrition Articles - SwiftHerb",
    description: "Evidence-based guides to supplements, vitamins, and natural health.",
  },
  alternates: {
    canonical: `${SITE_URL}/articles`,
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Health & Nutrition Articles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Evidence-based guides to supplements, vitamins, and natural health from our expert health writers
          </p>
        </div>

        {/* Categories Filter (optional - can be added later) */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
