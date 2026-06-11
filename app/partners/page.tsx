import type { Metadata } from "next";
import Link from "next/link";
import { getPartnerLandings } from "@/lib/partnerLandings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";

export const metadata: Metadata = {
  title: "Partner offers",
  description:
    "Hand-picked health, beauty, and wellness brands from our partner network — with quick guides to each.",
  alternates: {
    canonical: `${SITE_URL}/partners/`,
  },
};

export default function PartnersIndexPage() {
  const landings = getPartnerLandings();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Partner offers</h1>
      <p className="mb-10 max-w-2xl text-gray-600">
        Health, beauty, and wellness brands from our partner network. Pages may contain
        affiliate links — see our{" "}
        <Link href="/affiliate-disclosure/" className="underline hover:text-gray-800">
          disclosure
        </Link>
        .
      </p>
      {landings.length === 0 ? (
        <p className="text-gray-500">No partner offers are live yet — check back soon.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {landings.map((l) => (
            <li
              key={l.slug}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href={`/${l.slug}/`} className="block">
                {l.program.image ? (
                  <img
                    src={l.program.image}
                    alt=""
                    width={120}
                    height={40}
                    loading="lazy"
                    className="mb-4 h-10 w-auto object-contain"
                  />
                ) : null}
                <h2 className="font-semibold text-gray-900">
                  {l.content?.headline ?? l.program.name}
                </h2>
                {l.content?.subheadline ? (
                  <p className="mt-1 text-sm text-gray-600">{l.content.subheadline}</p>
                ) : null}
                {l.program.categories.length ? (
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-green-700">
                    {l.program.categories[0]?.name}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
