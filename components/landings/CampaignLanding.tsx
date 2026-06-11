import StructuredData from "@/components/StructuredData";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";
import type { PartnerLanding } from "@/lib/partnerLandings";
import { pickTemplate } from "@/lib/landingTemplates";
import { buildLandingView } from "./shared";
import { LandingClassic } from "./LandingClassic";
import { LandingSplit } from "./LandingSplit";
import { LandingEditorial } from "./LandingEditorial";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";

/**
 * Renders a partner landing page with one of three templates, chosen
 * deterministically per slug (see lib/landingTemplates.ts), plus the
 * page's JSON-LD (breadcrumbs + FAQ) for SEO/AEO.
 */
export function CampaignLanding({ landing }: { landing: PartnerLanding }) {
  const view = buildLandingView(landing);
  const template = pickTemplate(landing.slug);

  const schemas: object[] = [
    getBreadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Partner offers", url: `${SITE_URL}/partners/` },
      { name: view.name, url: `${SITE_URL}/${landing.slug}/` },
    ]),
  ];
  if (view.faq.length) schemas.push(getFAQSchema(view.faq));

  const Template =
    template === "split" ? LandingSplit : template === "editorial" ? LandingEditorial : LandingClassic;

  return (
    <>
      <StructuredData data={schemas} />
      <Template view={view} />
    </>
  );
}
