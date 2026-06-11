import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignLanding } from "@/components/landings/CampaignLanding";
import { getPartnerLandingBySlug, getPartnerLandings } from "@/lib/partnerLandings";

// Static export: only slugs from generateStaticParams are built; anything else 404s.
export const dynamicParams = false;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";

// output:'export' rejects an empty generateStaticParams result, so a placeholder
// page is emitted until the first harvested program produces real slugs.
const PLACEHOLDER_SLUG = "partner-offers-coming-soon";

export function generateStaticParams() {
  const landings = getPartnerLandings();
  if (landings.length === 0) return [{ slug: PLACEHOLDER_SLUG }];
  return landings.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === PLACEHOLDER_SLUG) {
    return {
      title: "Partner offers coming soon",
      robots: { index: false, follow: false },
    };
  }
  const landing = getPartnerLandingBySlug(slug);
  if (!landing) return {};
  // The layout template appends "| SwiftHerb"; drop any site-name suffix the
  // generated metaTitle already carries to avoid "… | Swiftherb | SwiftHerb".
  const title = (landing.content?.metaTitle ?? `${landing.program.name} — partner offer`)
    .replace(/\s*[|–—-]\s*[^|–—-]*swift\s*herb[^|]*$/i, "")
    .trim();
  const description =
    landing.content?.metaDescription ??
    landing.content?.subheadline ??
    `Learn about ${landing.program.name} and visit the official site.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${slug}/`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${slug}/`,
      title,
      description,
      ...(landing.program.image ? { images: [{ url: landing.program.image }] } : {}),
    },
  };
}

export default async function PartnerCampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === PLACEHOLDER_SLUG) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Partner offers coming soon</h1>
        <p className="text-gray-600">
          We are preparing hand-picked wellness partner deals. Check back shortly.
        </p>
      </div>
    );
  }
  const landing = getPartnerLandingBySlug(slug);
  if (!landing) notFound();
  return <CampaignLanding landing={landing} />;
}
