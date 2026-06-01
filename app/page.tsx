import ChatInterface from "@/components/ChatInterface";
import BestSellers from "@/components/BestSellers";
import TopBrands from "@/components/TopBrands";
import BrandsOverview from "@/components/BrandsOverview";
import StructuredData from "@/components/StructuredData";
import { getFAQSchema } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SwiftHerb | Supplements on iHerb, without the guesswork",
  description:
    "Use our catalog, articles, and chat to narrow vitamins and supplements on iHerb. Plain language, no white coats, and no paywall. Always confirm details on iHerb before you buy.",
  keywords: [
    "supplements",
    "vitamins",
    "iHerb",
    "supplement guide",
    "wellness",
    "natural health",
  ],
};

const faqs = [
  {
    question: "What is SwiftHerb?",
    answer:
      "SwiftHerb helps you explore supplements on iHerb with a catalog, short articles, and an AI chat. It is a discovery site, not medical advice.",
  },
  {
    question: "How do you pick products?",
    answer:
      "The chat uses our on-site product list and common pairings. Always read ingredients, dose, and reviews on iHerb before you buy.",
  },
  {
    question: "Is this medical advice?",
    answer:
      "No. Talk to a clinician if you are pregnant, on medication, or managing a condition.",
  },
  {
    question: "Where do the links go?",
    answer:
      "Product links go to iHerb. We are onboarding with Impact.com for affiliate tracking; details are on our Affiliate Disclosure page.",
  },
  {
    question: "Does it cost anything?",
    answer: "Browsing and chatting are free. You pay iHerb if you order.",
  },
];

export default function Home() {
  return (
    <>
      <StructuredData data={getFAQSchema(faqs)} />
      <div className="flex flex-col min-h-screen bg-gray-50/80">
        <main className="flex flex-col flex-1">
          <h1 className="sr-only">SwiftHerb: supplement discovery for iHerb</h1>

          {/* Compact hero */}
          <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-600 to-green-700 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide mb-1">
                  SwiftHerb
                </p>
                <p className="text-lg sm:text-xl font-semibold leading-snug">
                  Supplements on iHerb — ask first, then browse.
                </p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-white transition-colors"
              >
                Catalog
              </Link>
            </div>
          </div>

          {/* AI chat — primary */}
          <section
            aria-label="AI helper"
            className="bg-white border-b border-gray-200 shadow-sm"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-1">
              <h2 className="text-base font-semibold text-gray-900">AI helper</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Not medical advice. Opens iHerb when you click a product.
              </p>
            </div>
            <div className="flex flex-col min-h-[420px] max-h-[min(70vh,640px)]">
              <ChatInterface compact />
            </div>
          </section>

          <BestSellers compact />

          <TopBrands />
          <BrandsOverview />

          <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Browse by category</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Vitamins, minerals, herbs, and more — each page links to iHerb.
                </p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shrink-0"
              >
                Open catalog
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
