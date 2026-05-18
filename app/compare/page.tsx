import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Compare Supplements - SwiftHerb",
  description: "Compare vitamins, minerals, and supplements. Use our AI to get a personalized comparison and recommendations from iHerb.",
  keywords: ["compare supplements", "vitamin comparison", "supplement comparison", "iHerb"],
};

function getCategories(): string[] {
  const categories = new Set<string>();
  Object.values(MOCK_PRODUCTS).forEach((p) => categories.add(p.category));
  return Array.from(categories).sort();
}

export default function ComparePage() {
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
          Compare Supplements
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Get a personalized comparison of supplements tailored to your goals. Our AI recommends 5–10 products that work together so you can choose with confidence.
        </p>

        <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">How to compare</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li>Tell our AI your health goals or what you want to compare (e.g. magnesium for sleep, omega-3 for heart health).</li>
            <li>Get a personalized stack of 5–10 products with prices and descriptions.</li>
            <li>Use the comparison view in chat to see products side by side, then click through to iHerb to purchase.</li>
          </ol>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-medium"
          >
            Get personalized comparison
          </Link>
        </section>

        <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Compare by category</h2>
          <p className="text-gray-600 mb-4">
            We can help you compare products in these areas. Start a chat and ask for recommendations in any category.
          </p>
          <ul className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href="/"
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 text-center">
          <Link href="/how-it-works" className="text-green-600 hover:text-green-700 font-medium">
            Learn how our AI recommendations work →
          </Link>
        </div>
      </div>
    </div>
  );
}
