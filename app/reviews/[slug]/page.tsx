import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBrandSlugs, getBrandBySlug, getBrandMonogram } from "@/lib/brands";
import { generateAffiliateLink } from "@/lib/affiliate";
import StructuredData from "@/components/StructuredData";
import { getBreadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllBrandSlugs().map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) {
    return { title: "Review not found | SwiftHerb" };
  }
  const url = `${SITE_URL}/reviews/${slug}`;
  return {
    title: `${brand.name} review (template) | SwiftHerb`,
    description: `${brand.tagline} — editorial template overview with iHerb CTA. Not medical advice.`,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${brand.name} | SwiftHerb`,
      description: brand.teaser,
    },
  };
}

export default async function BrandReviewPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const brandShopHref = generateAffiliateLink({
    title: brand.name,
    iherb_url: brand.ctaHref,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Brand reviews", url: `${SITE_URL}/reviews` },
    { name: brand.name, url: `${SITE_URL}/reviews/${slug}` },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <article className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <nav className="text-sm text-emerald-100 mb-4" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
                <li>
                  <Link href="/" className="hover:text-white underline-offset-2 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/reviews" className="hover:text-white underline-offset-2 hover:underline">
                    Brand reviews
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-white font-medium">{brand.name}</li>
              </ol>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg ring-2 ring-white/30 ${brand.tileClass}`}
                aria-hidden
              >
                {getBrandMonogram(brand.name)}
              </div>
              <div>
                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide mb-2">
                  Template review
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{brand.name}</h1>
                <p className="mt-3 text-emerald-50 text-base leading-relaxed max-w-xl">{brand.tagline}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 mb-10">
            <strong>Template only.</strong> Not medical advice. Replace this page with dated editorial
            review content, sourcing, and affiliate disclosure as required before treating it as published
            guidance.
          </p>

          <div className="prose prose-gray max-w-none">
            {brand.overviewSections.map((section) => (
              <section key={section.heading} className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Shop this brand on iHerb</h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Opens iHerb in a new tab so you can confirm supplement facts, allergens, and reviews on the
              live listing.
            </p>
            <a
              href={brandShopHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-base font-semibold text-white hover:bg-green-700 transition-colors shadow-md"
            >
              {brand.ctaLabel}
            </a>
          </div>

          <p className="mt-10 text-center">
            <Link href="/reviews" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
              ← All brand reviews
            </Link>
          </p>
        </div>
      </article>
    </>
  );
}
