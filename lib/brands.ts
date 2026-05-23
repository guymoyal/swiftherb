/**
 * Template brand data for home (Top 3 + overview) and /reviews/[slug] pages.
 * Replace copy and CTA URLs with real editorial content when ready.
 */

export type Brand = {
  slug: string;
  name: string;
  /** Shown on home Top 3 cards */
  tagline: string;
  /** Optional ribbon, e.g. "Editor's pick" */
  highlight?: string;
  /** Sort order in overview grid (1 = first) */
  sortOrder: number;
  /** Included in the Top 3 strip */
  featuredTopThree: boolean;
  /** Short line under logo tile in overview */
  teaser: string;
  /** Review page — body sections (template) */
  overviewSections: { heading: string; body: string }[];
  ctaLabel: string;
  /** e.g. iHerb search — not affiliate-wrapped until programs are live */
  ctaHref: string;
  /** Tailwind bg class for monogram tile */
  tileClass: string;
};

export const BRANDS: Brand[] = [
  {
    slug: "garden-of-life",
    name: "Garden of Life",
    tagline: "Whole-food formulas and broad shelf presence.",
    highlight: "Top pick",
    sortOrder: 1,
    featuredTopThree: true,
    teaser: "Probiotics, protein, and organics-heavy lineup.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template overview: describe positioning, typical categories (e.g. probiotics, greens), and how shoppers use this brand on iHerb. Replace with your editorial take.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: remind readers to check supplement facts, allergen statements, lot-specific third-party seals, and recent reviews on the live listing—not on this static page.",
      },
      {
        heading: "Editorial note",
        body: "SwiftHerb does not provide medical advice. This page is a non-exhaustive template for future reviews and may be outdated relative to iHerb.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Garden%20of%20Life",
    tileClass: "bg-emerald-700",
  },
  {
    slug: "nordic-naturals",
    name: "Nordic Naturals",
    tagline: "Fish oil and omega-3 focused catalog.",
    highlight: "Omega-3",
    sortOrder: 2,
    featuredTopThree: true,
    teaser: "Concentrated omega formulas and testing callouts on labels.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template overview: marine-sourced omegas, concentration tiers, and flavor formats. Replace with researched copy.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: EPA/DHA per serving, form (triglyceride vs ethyl ester if stated), freshness dating, and current iHerb imagery.",
      },
      {
        heading: "Editorial note",
        body: "Informational only; not medical advice. Confirm suitability with a clinician.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Nordic%20Naturals",
    tileClass: "bg-sky-700",
  },
  {
    slug: "thorne-research",
    name: "Thorne",
    tagline: "Clinician-adjacent positioning and single-ingredient SKUs.",
    highlight: "Premium lane",
    sortOrder: 3,
    featuredTopThree: true,
    teaser: "Often chosen for minimalist formulas and testing transparency on-pack.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template overview: professional channel heritage, capsule counts, and price band vs mass-market brands.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: verify active forms (e.g. B vitamins), excipients, and the exact SKU you intend to buy—Thorne has many lookalike labels.",
      },
      {
        heading: "Editorial note",
        body: "Template placeholder; no therapeutic claims.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Thorne%20Research",
    tileClass: "bg-slate-800",
  },
  {
    slug: "now-foods",
    name: "NOW Foods",
    tagline: "Value-forward breadth across categories.",
    sortOrder: 4,
    featuredTopThree: false,
    teaser: "Huge SKU surface: basics, sports, and pantry staples.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template: mass-market accessibility, frequent promos on iHerb, and wide flavor/format options.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: country of manufacture changes, allergen lines, and size variants—always open the live listing.",
      },
      {
        heading: "Editorial note",
        body: "Placeholder review body.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=NOW%20Foods",
    tileClass: "bg-orange-600",
  },
  {
    slug: "solgar",
    name: "Solgar",
    tagline: "Classic vitamin aisle heritage.",
    sortOrder: 5,
    featuredTopThree: false,
    teaser: "Gold-label aesthetic; strong multivitamin and mineral assortment.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template overview for Solgar—replace with your narrative.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: tablet sizes, iron-containing variants, and regional formulation differences.",
      },
      {
        heading: "Editorial note",
        body: "Placeholder.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Solgar",
    tileClass: "bg-amber-700",
  },
  {
    slug: "gaia-herbs",
    name: "Gaia Herbs",
    tagline: "Liquid extracts and herb-forward blends.",
    sortOrder: 6,
    featuredTopThree: false,
    teaser: "Herbal singles and complexes with traceability storytelling.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template: liquid vs capsule lines, concentration notation, and how you plan to review batches/lots later.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: alcohol content in tinctures, pregnancy warnings on label screenshots.",
      },
      {
        heading: "Editorial note",
        body: "Placeholder.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Gaia%20Herbs",
    tileClass: "bg-green-800",
  },
  {
    slug: "life-extension",
    name: "Life Extension",
    tagline: "Science-forward copy and wide longevity-adjacent range.",
    sortOrder: 7,
    featuredTopThree: false,
    teaser: "Deep catalog; good for template “long review” pages later.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template overview.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: co-formulations, caffeine-containing stacks, and label updates.",
      },
      {
        heading: "Editorial note",
        body: "Placeholder.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Life%20Extension",
    tileClass: "bg-violet-800",
  },
  {
    slug: "jarrow-formulas",
    name: "Jarrow Formulas",
    tagline: "Workhorse staples and joint stacks.",
    sortOrder: 8,
    featuredTopThree: false,
    teaser: "Familiar labels for basics and niche single-ingredients.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template overview.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: reformulations—compare supplement facts year-over-year when you write the real review.",
      },
      {
        heading: "Editorial note",
        body: "Placeholder.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Jarrow%20Formulas",
    tileClass: "bg-yellow-700",
  },
  {
    slug: "natures-way",
    name: "Nature's Way",
    tagline: "Mass-market herbs and immune-season staples.",
    sortOrder: 9,
    featuredTopThree: false,
    teaser: "Accessible pricing; strong seasonal visibility.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template overview.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: line extensions (gummies vs capsules) and sugar content in gummy formats.",
      },
      {
        heading: "Editorial note",
        body: "Placeholder.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Nature%27s%20Way",
    tileClass: "bg-lime-800",
  },
  {
    slug: "doctors-best",
    name: "Doctor's Best",
    tagline: "Science-branded singles at competitive price points.",
    sortOrder: 10,
    featuredTopThree: false,
    teaser: "Magnesium, curcumin, and other high-volume SKUs.",
    overviewSections: [
      {
        heading: "Brand snapshot",
        body: "Template overview.",
      },
      {
        heading: "What to verify on the retailer",
        body: "Template: chelate names, elemental mineral amounts, and capsule load.",
      },
      {
        heading: "Editorial note",
        body: "Placeholder.",
      },
    ],
    ctaLabel: "Browse on iHerb",
    ctaHref: "https://www.iherb.com/search?kw=Doctor%27s%20Best",
    tileClass: "bg-red-800",
  },
];

export function getAllBrands(): Brand[] {
  return [...BRANDS].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getTopThreeBrands(): Brand[] {
  return getAllBrands().filter((b) => b.featuredTopThree).slice(0, 3);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function getAllBrandSlugs(): string[] {
  return BRANDS.map((b) => b.slug);
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getBrandMonogram(name: string): string {
  return initials(name);
}
