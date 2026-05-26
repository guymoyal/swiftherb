import Link from "next/link";
import { getTopThreeBrands, getBrandMonogram } from "@/lib/brands";
import { generateAffiliateLink } from "@/lib/affiliate";

/**
 * Prominent Top 3 brand strip (template) — mirrors “hero picks” patterns on comparison sites.
 */
export default function TopBrands() {
  const top = getTopThreeBrands();

  return (
    <section className="border-b border-emerald-100/80 bg-white py-10 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-2">
            Brand notes
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Three lines we are writing up first</h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
            Short blurbs link out to iHerb the same way product cards do. Full reviews will roll in over time;
            for now this is a layout you can grow into.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {top.map((brand, index) => (
            <article
              key={brand.slug}
              className="group relative flex flex-col rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/80 p-5 shadow-sm ring-1 ring-gray-100 transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-inner ${brand.tileClass}`}
                  aria-hidden
                >
                  {getBrandMonogram(brand.name)}
                </div>
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                  #{index + 1}
                </span>
              </div>
              {brand.highlight ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">
                  {brand.highlight}
                </p>
              ) : null}
              <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">{brand.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/reviews/${brand.slug}`}
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Full review
                </Link>
                <a
                  href={generateAffiliateLink({
                    title: brand.name,
                    iherb_url: brand.ctaHref,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Shop iHerb
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
