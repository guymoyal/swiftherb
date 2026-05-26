import Link from "next/link";
import { getAllBrands, getBrandMonogram } from "@/lib/brands";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supplement brand notes | SwiftHerb",
  description:
    "Working drafts for brands sold on iHerb. Each page lists what we would want a reader to check before buying. Not medical advice.",
};

export default function ReviewsIndexPage() {
  const brands = getAllBrands();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-2">In progress</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Brand notes</h1>
        <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
          These pages are shells with honest disclaimers. Fill them in when you have something useful to say,
          then link them from articles or social posts.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 list-none p-0">
          {brands.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/reviews/${b.slug}`}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-emerald-200 hover:shadow transition"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${b.tileClass}`}
                >
                  {getBrandMonogram(b.name)}
                </span>
                <span>
                  <span className="block font-semibold text-gray-900">{b.name}</span>
                  <span className="block text-sm text-gray-500 line-clamp-1">{b.teaser}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
