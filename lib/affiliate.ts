/**
 * Unified affiliate link generator
 * Uses Admitad for affiliate links
 */

import { generateAdmitadDeeplink, generateAdmitadSearchLink } from "./admitad";

/**
 * Generate affiliate link for a product
 * Uses Admitad if configured, otherwise falls back to direct iHerb link
 * 
 * @param product - Product object with title and optional iherb_url
 * @returns Affiliate link (Admitad deeplink or direct iHerb link)
 */
export function generateAffiliateLink(product: { title: string; iherb_url?: string }): string {
  // Check if Admitad is configured
  const admitadWId = process.env.NEXT_PUBLIC_ADMITAD_W_ID;
  const admitadCId = process.env.NEXT_PUBLIC_ADMITAD_C_ID;
  
  if (admitadWId && admitadCId) {
    // Use Admitad deeplinks
    if (product.iherb_url) {
      // Use deeplink if product URL is available
      return generateAdmitadDeeplink(product.iherb_url);
    } else {
      // Fallback to search link
      return generateAdmitadSearchLink(product.title);
    }
  } else {
    // Fallback to direct iHerb link (no affiliate tracking until Admitad is configured)
    const encoded = encodeURIComponent(product.title);
    return `https://www.iherb.com/search?kw=${encoded}`;
  }
}
