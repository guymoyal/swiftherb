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
      "SwiftHerb is a side project built around one retailer: iHerb. We group products into categories, publish short articles, and run a chat that suggests ideas when you tell us what you are trying to fix (sleep, stress, energy, and so on). Think of it as a map, not a prescription.",
  },
  {
    question: "How do you pick products?",
    answer:
      "The chat reads what you wrote and pulls from the same product list we use on the site. Nothing is magic: it is pattern matching plus common supplement pairings. You still need to read ingredients, dose, and reviews on iHerb.",
  },
  {
    question: "Is this medical advice?",
    answer:
      "No. We are not your doctor, nurse, or pharmacist. If you are pregnant, on medication, or managing a condition, talk to a clinician before you change supplements.",
  },
  {
    question: "Where do the links go?",
    answer:
      "Most buttons send you to iHerb. Some links pass through an affiliate tracker first so the site can earn a small commission if you buy. That does not change the price you pay on iHerb. Read the Affiliate Disclosure page for the current setup.",
  },
  {
    question: "Does it cost anything?",
    answer:
      "Browsing and chatting are free. You pay iHerb if you decide to order something.",
  },
];

export default function Home() {
  return (
    <>
      <StructuredData data={getFAQSchema(faqs)} />
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50/90 via-white to-gray-50/90">
        <main className="flex flex-col flex-1">
          <h1 className="sr-only">SwiftHerb: supplement discovery for iHerb</h1>

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
                    Supplements on iHerb
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">
                    Less tab hopping, more &apos;oh, that might work&apos;
                  </h2>
                  <p className="text-emerald-50/95 text-base sm:text-lg leading-relaxed">
                    Tell the assistant what you are dealing with in normal words. It throws out a short
                    list you can open on iHerb where the photos, supplement facts, and one-star reviews
                    already live. We are not here to diagnose anything, only to save you a little time.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {["Category pages", "Links to iHerb", "Chat stays in your browser"].map((label) => (
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

          <TopBrands />
          <BrandsOverview />

          {/* Product cards */}
          <BestSellers />

          <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-10 sm:py-12">
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-6 sm:p-8 shadow-sm ring-1 ring-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Browse by category</h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Each tile opens a page of cards. Click through to iHerb when you want the full label,
                    price, and verified buyer comments.
                  </p>
                </div>
                <Link
                  href="/catalog"
                  className="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm sm:text-base hover:bg-green-700 transition-colors shadow-md hover:shadow-lg shrink-0"
                >
                  Open catalog
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
                Chat assistant
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Stuck? Start with one sentence.
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base max-w-2xl">
                Example: &apos;I travel a lot and sleep badly.&apos; We will toss back a few products to inspect on
                iHerb. If something feels off, stop and ask a professional.
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
