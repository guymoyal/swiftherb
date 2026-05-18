import type { Metadata } from "next";
import Link from "next/link";
import { getPageContent } from "@/lib/content";
import PageContentRenderer from "@/components/PageContent";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how SwiftHerb's AI recommends personalized supplement stacks and why we suggest 5–10 products.",
};

const stats = [
  { value: "5–10", label: "Products per personalized stack" },
  { value: "AI-driven", label: "Recommendations based on your goals" },
  { value: "Free", label: "No cost to use" },
  { value: "iHerb", label: "Trusted retailer for all products" },
];

export default function HowItWorksPage() {
  const content = getPageContent("how-it-works");

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Content not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          {/* Stats block */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12" aria-label="Key facts">
            {stats.map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </section>
          <PageContentRenderer content={content} />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
        >
          Try the AI assistant
        </Link>
      </div>
    </>
  );
}
