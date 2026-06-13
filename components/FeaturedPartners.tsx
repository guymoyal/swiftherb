import Link from "next/link";
import { getFeaturedPartnerLandings } from "@/lib/partnerLandings";

/**
 * Homepage grid of hand-picked supplement / nutrition / herbal brands from our
 * partner network. Each card links to its on-site landing page, where the
 * ad-blocker-resistant affiliate CTA lives.
 */
export default function FeaturedPartners() {
  const landings = getFeaturedPartnerLandings();
  if (landings.length === 0) return null;

  return (
    <section
      aria-label="Featured wellness brands"
      className="w-full bg-gray-50/80 border-t border-gray-200"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop wellness brands</h2>
            <p className="mt-1 text-sm text-gray-600">
              Supplements, vitamins, herbal &amp; collagen brands from our partner network.
            </p>
          </div>
          <Link
            href="/partners/"
            className="text-sm font-semibold text-green-700 hover:text-green-800 hover:underline shrink-0"
          >
            View all partners →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {landings.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/${l.slug}/`}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex h-12 items-center">
                  {l.program.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.program.image}
                      alt=""
                      width={120}
                      height={40}
                      loading="lazy"
                      className="h-10 w-auto max-w-[70%] object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-900">{l.program.name}</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-green-700">
                  {l.content?.headline ?? l.program.name}
                </h3>
                {l.content?.subheadline ? (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-600">
                    {l.content.subheadline}
                  </p>
                ) : null}
                <span className="mt-auto pt-3 text-xs font-semibold uppercase tracking-wide text-green-700">
                  View offer →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-gray-400">
          Partner links may earn SwiftHerb a commission at no extra cost to you. See our{" "}
          <Link href="/affiliate-disclosure/" className="underline hover:text-gray-600">
            affiliate disclosure
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
