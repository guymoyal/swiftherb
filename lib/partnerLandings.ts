import fs from "fs";
import path from "path";

export interface PartnerLandingContent {
  headline: string;
  subheadline: string;
  intro: string;
  benefits: Array<{ title: string; description: string }>;
  howItWorks: string[];
  faq: Array<{ question: string; answer: string }>;
  ctaLabel: string;
  metaTitle: string;
  metaDescription: string;
  language?: string;
  generatedAt?: string;
}

export interface PartnerLanding {
  slug: string;
  path: string;
  gotolink: string;
  program: {
    name: string;
    description: string | null;
    siteUrl: string | null;
    image: string | null;
    categories: Array<{ id: number | null; name: string }>;
  };
  content: PartnerLandingContent | null;
}

const DATA_FILE = path.join(process.cwd(), "content", "admitad-landings.json");

/** Entries that can become live pages: programs with a tracking link. */
export function getPartnerLandings(): PartnerLanding[] {
  let payload: any;
  try {
    payload = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
  const entries: any[] = Array.isArray(payload?.entries) ? payload.entries : [];
  return entries
    .filter((e) => e?.admitad?.gotolink && e?.slug)
    .map((e) => ({
      slug: e.slug,
      path: e.path,
      gotolink: e.admitad.gotolink,
      program: {
        name: e.program?.name ?? e.slug,
        description: e.program?.description ?? null,
        siteUrl: e.program?.siteUrl ?? null,
        image: e.program?.image ?? null,
        categories: e.program?.categories ?? [],
      },
      content: e.content ?? null,
    }))
    .sort((a, b) => a.program.name.localeCompare(b.program.name));
}

export function getPartnerLandingBySlug(slug: string): PartnerLanding | undefined {
  return getPartnerLandings().find((e) => e.slug === slug);
}

/**
 * Hand-picked supplement / nutrition / herbal / collagen brands — the partner
 * programs closest to what people shop for on iHerb. Used to feature cards on
 * the homepage. Order here is the display order; missing slugs are skipped.
 */
export const FEATURED_PARTNER_SLUGS: string[] = [
  "xena-nutrition-us",
  "cured-nutrition-us",
  "novomins-uk",
  "kapiva-cps-in-2",
  "herb-and-root-us",
  "garden-of-wellness-my",
  "relief-factor-us",
  "kinohimitsu-sg-cps",
  "pai-wellness-cps-my",
  "vitaminler-cpssatis-tr",
  "usvidaglowcom",
  "polskie-centrum-kolagenu",
];

export function getFeaturedPartnerLandings(
  slugs: string[] = FEATURED_PARTNER_SLUGS,
): PartnerLanding[] {
  const all = getPartnerLandings();
  const bySlug = new Map(all.map((l) => [l.slug, l] as const));
  return slugs.map((s) => bySlug.get(s)).filter((l): l is PartnerLanding => Boolean(l));
}
