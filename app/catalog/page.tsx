import type { Metadata } from "next";
import Link from "next/link";
import { getCatalogCategories, getCatalogProductCount } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Supplement Catalog by Category | SwiftHerb",
  description:
    "Browse supplement categories with editorial product cards linking to iHerb for full details, imagery, and verified customer reviews.",
};

export default function CatalogIndexPage() {
  const categories = getCatalogCategories();
  const count = getCatalogProductCount();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Catalog</span>
        </nav>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Supplement catalog
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            SwiftHerb lists popular categories to help you discover products sold on{" "}
            <a
              href="https://www.iherb.com"
              className="text-green-700 hover:underline font-medium"
              rel="noopener noreferrer"
            >
              iHerb
            </a>
            . Cards summarize what we show on this site; pricing, availability, images, and
            star ratings always come from iHerb when you click through.
          </p>
          <p className="mt-4 text-sm text-gray-500 max-w-3xl">
            This section is informational and not medical advice. We may earn commissions when
            affiliate programs approve our application; until then, links go directly to iHerb
            with no tracking. See our{" "}
            <Link href="/affiliate-disclosure" className="text-green-700 hover:underline">
              disclosure
            </Link>{" "}
            and{" "}
            <Link href="/editorial-standards" className="text-green-700 hover:underline">
              editorial standards
            </Link>
            .
          </p>
          <p className="mt-3 text-sm font-medium text-gray-700">
            {count} products indexed on-site across {categories.length} categories.
          </p>
        </header>

        <ul className="grid sm:grid-cols-2 gap-5">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/catalog/${c.slug}`}
                className="block h-full p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-green-200 transition-all group"
              >
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-green-700 mb-2">
                  {c.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{c.description}</p>
                <span className="inline-block mt-4 text-green-600 font-semibold text-sm">
                  View products →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "SwiftHerb supplement catalog",
            description:
              "Category index of supplements with links to iHerb for purchasing and reviews.",
          }),
        }}
      />
    </div>
  );
}
