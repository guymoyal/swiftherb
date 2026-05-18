/**
 * Unified affiliate link generator
 * Priority: Admitad → Partnerize → plain iHerb
 */

import { generateAdmitadDeeplink, generateAdmitadSearchLink } from "./admitad";
import {
  generatePartnerizeProductLink,
  generatePartnerizeSearchLink,
} from "./partnerize";

/**
 * Generate affiliate link for a product
 *
 * @param product - Product object with title and optional iherb_url
 * @returns Affiliate link (tracked when Admitad or Partnerize env is set)
 */
export function generateAffiliateLink(product: { title: string; iherb_url?: string }): string {
  const admitadWId = process.env.NEXT_PUBLIC_ADMITAD_W_ID;
  const admitadCId = process.env.NEXT_PUBLIC_ADMITAD_C_ID;

  if (admitadWId && admitadCId) {
    if (product.iherb_url) {
      return generateAdmitadDeeplink(product.iherb_url);
    }
    return generateAdmitadSearchLink(product.title);
  }

  const camref = process.env.NEXT_PUBLIC_PARTNERIZE_CAMREF;
  if (camref) {
    if (product.iherb_url) {
      return generatePartnerizeProductLink(product.iherb_url, camref);
    }
    return generatePartnerizeSearchLink(product.title, camref);
  }

  const encoded = encodeURIComponent(product.title);
  return `https://www.iherb.com/search?kw=${encoded}`;
}
