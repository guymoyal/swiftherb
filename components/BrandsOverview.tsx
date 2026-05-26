import Link from "next/link";
import { getAllBrands, getBrandMonogram } from "@/lib/brands";

/**
 * Full brand grid with Full review links under the top three picks.
 */
export default function BrandsOverview() {
  const brands = getAllBrands();

  return (
    <section className="py-10 sm:py-12 bg-gradient-to-b from-gray-50/90 to-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">
              Brand directory
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">More brands on the way</h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-2xl">
              Each tile jumps to a draft review page. When you are ready, swap initials for real logos and
              add the story you want Google to index.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 list-none p-0 m-0">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition hover:border-emerald-200 hover:shadow">
                <div
                  className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl text-lg font-bold text-white ${brand.tileClass}`}
                  aria-hidden
                >
                  {getBrandMonogram(brand.name)}
                </div>
                <p className="text-sm font-semibold text-gray-900 leading-snug">{brand.name}</p>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">{brand.teaser}</p>
                <Link
                  href={`/reviews/${brand.slug}`}
                  className="mt-3 inline-flex items-center justify-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
                >
                  Full review
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
