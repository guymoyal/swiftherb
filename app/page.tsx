import ChatInterface from "@/components/ChatInterface";
import BestSellers from "@/components/BestSellers";
import StructuredData from "@/components/StructuredData";
import { getFAQSchema } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SwiftHerb - AI Pharmacist Assistant for Natural Health Products",
  description:
    "Get personalized supplement recommendations from our AI pharmacist assistant. Find the best vitamins, minerals, and natural health products from iHerb.",
  keywords: [
    "AI pharmacist",
    "supplement recommendations",
    "natural health",
    "vitamins",
    "supplements",
    "iHerb",
    "health products",
  ],
};

const faqs = [
  {
    question: "What is SwiftHerb?",
    answer:
      "SwiftHerb is an AI-powered pharmacist assistant that helps you find the best natural health products and supplements. Our AI analyzes your needs and recommends personalized products from iHerb.",
  },
  {
    question: "How does SwiftHerb recommend products?",
    answer:
      "SwiftHerb uses advanced AI to understand your health goals, symptoms, or questions. Based on your input, our AI pharmacist suggests relevant supplements, vitamins, and natural health products.",
  },
  {
    question: "Are the recommendations medical advice?",
    answer:
      "No. SwiftHerb provides informational recommendations only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a healthcare provider before starting any supplement regimen.",
  },
  {
    question: "Where do the products come from?",
    answer:
      "SwiftHerb highlights products sold on iHerb, a large natural-health retailer. Our catalog and AI suggestions link you to iHerb for official images, supplement facts, and customer reviews. We may use affiliate tracking only when we are accepted into a program and disclose it on our Affiliate Disclosure page; otherwise links go directly to iHerb.",
  },
  {
    question: "Is SwiftHerb free to use?",
    answer:
      "Yes, SwiftHerb is completely free to use. You can chat with our AI pharmacist assistant and get product recommendations at no cost.",
  },
];

export default function Home() {
  return (
    <>
      <StructuredData data={getFAQSchema(faqs)} />
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50/90 via-white to-gray-50/90">
        <main className="flex flex-col flex-1">
          <h1 className="sr-only">SwiftHerb - AI Pharmacist Assistant for Natural Health Products</h1>

          {/* Hero */}
          <div className="relative overflow-hidden border-b border-emerald-100/80 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-emerald-100 text-sm font-semibold tracking-wide uppercase mb-2">
                    Natural health · Smarter discovery
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">
                    Your AI guide to supplements on iHerb
                  </h2>
                  <p className="text-emerald-50/95 text-base sm:text-lg leading-relaxed">
                    Ask in plain language, get thoughtful suggestions, then open real iHerb listings with
                    photos, reviews, and labels—not medical advice, just a faster path to what might fit
                    your goals.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {["Editorial catalog", "Direct iHerb links", "Privacy-first chat"].map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 text-xs sm:text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 font-semibold text-green-800 shadow-md hover:bg-emerald-50 transition-colors"
                >
                  Browse catalog
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 font-semibold text-white hover:bg-white/15 transition-colors"
                >
                  How it works
                </Link>
              </div>
            </div>
          </div>

          {/* Product cards right below hero */}
          <BestSellers />

          <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-10 sm:py-12">
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-6 sm:p-8 shadow-sm ring-1 ring-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shop by category on iHerb</h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Curated category pages with product cards—each links to iHerb so you always see current
                    pack shots, price, and verified customer reviews.
                  </p>
                </div>
                <Link
                  href="/catalog"
                  className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm sm:text-base hover:bg-green-700 transition-colors shadow-md hover:shadow-lg shrink-0"
                >
                  Open catalog →
                </Link>
              </div>
            </div>
          </section>

          {/* AI chat at bottom */}
          <section
            aria-label="AI Chat Assistant"
            className="flex flex-col border-t border-gray-200 bg-gradient-to-b from-gray-50/90 to-white min-h-[560px] pb-8"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full pt-8 sm:pt-10 pb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">
                AI assistant
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Ask for personalized picks
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base max-w-2xl">
                Describe your goals or concerns—we&apos;ll suggest supplements that may fit. Not medical
                advice; always confirm with a clinician.
              </p>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <ChatInterface />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
