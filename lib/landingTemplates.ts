/**
 * Template + hero-image selection for partner landing pages.
 *
 * Both choices are deterministic hashes of the slug, so a given program always
 * renders the same template/hero across builds (stable for SEO and caching),
 * while the set of pages as a whole gets visual variety.
 *
 * Hero images are hotlinked from the Unsplash CDN (next.config.ts already
 * allowlists images.unsplash.com; the site's articles use the same source).
 * Every photo id below was verified to resolve and visually checked on 2026-06-11.
 */

export type LandingTemplate = "classic" | "split" | "editorial";

export interface HeroImage {
  id: string;
  alt: string;
}

const HERO_POOLS: Record<string, HeroImage[]> = {
  beauty: [
    { id: "photo-1540555700478-4be289fbecef", alt: "Spa still life with a lotion bottle, rolled towel and pink tulips" },
    { id: "photo-1612817288484-6f916006741a", alt: "Apothecary bottles and natural skincare arranged with botanicals" },
    { id: "photo-1505944270255-72b8c68c6a70", alt: "Relaxing citrus facial bath with orange and lemon slices" },
    { id: "photo-1596462502278-27bfdc403348", alt: "Minimal flat lay of makeup brushes and cosmetics" },
  ],
  pharmacy: [
    { id: "photo-1471864190281-a93a3070b6de", alt: "Assorted vitamins and supplement capsules" },
    { id: "photo-1512069772995-ec65ed45afd6", alt: "Supplement tablets and omega softgels spilling from a bottle" },
    { id: "photo-1607619056574-7b8d3ee536b2", alt: "Colorful assortment of pills and capsules" },
    { id: "photo-1584308666744-24d5c474f2ae", alt: "Medicine blister packs on a blue background" },
    { id: "photo-1587854692152-cbe660dbde88", alt: "Orange and white capsules spilling from a pill bottle" },
  ],
  health: [
    { id: "photo-1505751172876-fa1923c5c528", alt: "Stethoscope resting on a table" },
    { id: "photo-1506126613408-eca07ce68773", alt: "Person meditating at sunrise" },
    { id: "photo-1540420773420-3366772f4999", alt: "Fresh vegetable bowl with leafy greens and avocado" },
    { id: "photo-1490645935967-10de6ba17061", alt: "Healthy plate with eggs, greens and vegetables" },
    { id: "photo-1519823551278-64ac92734fb1", alt: "Hands applying a drop from an essential oil bottle" },
  ],
  fitness: [
    { id: "photo-1544367567-0f2fcb009e0b", alt: "Yoga pose silhouetted against a sunset sky" },
    { id: "photo-1545205597-3d9d02c29597", alt: "Group practicing yoga on the beach" },
    { id: "photo-1506126613408-eca07ce68773", alt: "Person meditating at sunrise" },
  ],
  wellness: [
    { id: "photo-1612817288484-6f916006741a", alt: "Apothecary bottles and natural skincare arranged with botanicals" },
    { id: "photo-1519823551278-64ac92734fb1", alt: "Hands applying a drop from an essential oil bottle" },
    { id: "photo-1540420773420-3366772f4999", alt: "Fresh vegetable bowl with leafy greens and avocado" },
  ],
};

/** djb2 — tiny stable string hash. */
function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return h >>> 0;
}

const TEMPLATES: LandingTemplate[] = ["classic", "split", "editorial"];

export function pickTemplate(slug: string): LandingTemplate {
  return TEMPLATES[hash(`tpl:${slug}`) % TEMPLATES.length];
}

export function pickHeroImage(
  slug: string,
  programName: string,
  categoryNames: string[]
): HeroImage {
  const text = `${programName} ${categoryNames.join(" ")}`.toLowerCase();
  let theme: keyof typeof HERO_POOLS = "wellness";
  if (/fitness|sport|gym|yoga|workout|run/.test(text)) theme = "fitness";
  else if (/beauty|cosmetic|skin|hair|makeup|make-up|perfume|fragran|spa|nail|care/.test(text)) theme = "beauty";
  else if (/pharma|vitamin|supplement|nutri|medic|drug/.test(text)) theme = "pharmacy";
  else if (/health|clinic|doctor|dental|lab|telemed/.test(text)) theme = "health";
  const pool = HERO_POOLS[theme];
  return pool[hash(`img:${slug}`) % pool.length];
}

export function unsplashUrl(id: string, width: number): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=70`;
}

/** Responsive srcset so mobile never downloads the desktop hero (PageSpeed). */
export function heroSrcSet(id: string): string {
  return [480, 800, 1200]
    .map((w) => `${unsplashUrl(id, w)} ${w}w`)
    .join(", ");
}
