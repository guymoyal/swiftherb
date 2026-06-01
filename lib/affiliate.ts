/**
 * Outbound iHerb links for product CTAs.
 * Uses direct iHerb URLs until Impact.com tracking is wired after program approval.
 */

export function iherbDestinationUrl(product: {
  title: string;
  iherb_url?: string;
}): string {
  const title = product.title?.trim() || "supplements";
  return (
    product.iherb_url?.trim() ||
    `https://www.iherb.com/search?kw=${encodeURIComponent(title)}`
  );
}

/** Product / brand CTA href (catalog, chat cards, reviews). */
export function generateAffiliateLink(product: {
  title: string;
  iherb_url?: string;
}): string {
  return iherbDestinationUrl(product);
}
