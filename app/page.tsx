import ChatInterface from "@/components/ChatInterface";
import BestSellers from "@/components/BestSellers";
import TopBrands from "@/components/TopBrands";
import BrandsOverview from "@/components/BrandsOverview";
import FeaturedPartners from "@/components/FeaturedPartners";
import StructuredData from "@/components/StructuredData";
import { getFAQSchema } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SwiftHerb | Supplements & wellness brands, without the guesswork",
  description:
    "Discover supplements, vitamins, and herbal wellness brands — browse our iHerb catalog, shop hand-picked partner brands, or ask our AI helper. Always confirm details before you buy.",
  keywords: [
    "supplements",
    "vitamins",
    "iHerb",
    "supplement guide",
    "wellness",
    "natural health",
    "herbal supplements",
    "collagen",
  ],
};

const faqs = [
  {
    question: "What is SwiftHerb?",
    answer:
      "SwiftHerb helps you discover supplements and wellness brands. Browse our iHerb catalog, explore hand-picked partner brands, or ask our AI chat. It is a discovery site, not medical advice.",
  },
  {
    question: "How do you pick products?",
    answer:
      "We feature wellness and supplement brands from our partner network, plus an iHerb catalog and chat. Always read ingredients, dose, and reviews before you buy.",
  },
  {
    question: "Is this medical advice?",
    answer:
      "No. Talk to a clinician if you are pregnant, on medication, or managing a condition.",
  },
  {
    question: "Where do the links go?",
    answer:
      "Catalog links go to iHerb; partner brand pages link to each brand's store. Some links are affiliate links — see our Affiliate Disclosure page.",
  },
  {
    question: "Does it cost anything?",
    answer: "Browsing and chatting are free. You only pay the store if you order.",
  },
];

export default function Home() {
  return (
    <>
      <StructuredData data={getFAQSchema(faqs)} />
      <div className="flex flex-col min-h-screen bg-gray-50/80">
        <main className="flex flex-col flex-1">
          {/* Hero */}
          <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-600 via-green-600 to-green-700 text-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
              <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide mb-3">
                Supplements &amp; natural wellness
              </p>
              <h1 className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Find supplements and wellness brands, without the guesswork.
              </h1>
              <p className="mt-4 max-w-2xl text-emerald-50 text-base sm:text-lg leading-relaxed">
                Browse our iHerb catalog, shop hand-picked vitamin, herbal, and collagen
                brands, or ask our AI helper. Plain language, no white coats, no paywall.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="#wellness-brands"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-green-800 shadow-sm hover:bg-emerald-50 transition-colors"
                >
                  Shop wellness brands
                </Link>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center rounded-lg bg-green-800/40 px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 hover:bg-green-800/60 transition-colors"
                >
                  Browse iHerb catalog
                </Link>
              </div>
            </div>
          </section>

          {/* Featured partner / wellness brand cards */}
          <div id="wellness-brands" className="scroll-mt-4">
            <FeaturedPartners />
          </div>

          {/* iHerb bestsellers + brands */}
          <BestSellers compact />
          <TopBrands />
          <BrandsOverview />

          {/* AI helper — demoted below the primary content */}
          <section
            aria-label="AI helper"
            className="bg-white border-y border-gray-200"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-1">
              <h2 className="text-xl font-bold text-gray-900">
                Not sure where to start? Ask our AI helper
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Describe what you&apos;re looking for and get suggestions. Not medical advice —
                opens iHerb when you click a product.
              </p>
            </div>
            <div className="flex flex-col min-h-[380px] max-h-[min(60vh,560px)]">
              <ChatInterface compact />
            </div>
          </section>

          {/* Category CTA */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-8">
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
