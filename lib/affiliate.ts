/**
 * Unified outbound iHerb link generator.
 * Priority: Admitad tatrck (interim) → Admitad API deeplink → Partnerize → plain iHerb
 */

import {
  generateAdmitadDeeplink,
  generateAdmitadSearchLink,
  isAdmitadTatrckWrappingEnabled,
  isAdmitadTatrckUrl,
  isLikelyIHerbRetailUrl,
  wrapDestinationWithAdmitadTatrck,
} from "./admitad";
import {
  generatePartnerizeProductLink,
  generatePartnerizeSearchLink,
} from "./partnerize";

/**
 * Affiliate / tracking link for a product CTA (AI cards, catalog, best sellers, etc.).
 * When tatrck wrapping is enabled (default), iHerb destinations use your Admitad redirect
 * until official iHerb program links are available.
 */
export function generateAffiliateLink(product: { title: string; iherb_url?: string }): string {
  const title = product.title?.trim() || "supplements";
  const targetUrl =
    product.iherb_url?.trim() ||
    `https://www.iherb.com/search?kw=${encodeURIComponent(title)}`;

  if (isAdmitadTatrckUrl(targetUrl)) {
    return targetUrl;
  }

  if (
    isAdmitadTatrckWrappingEnabled() &&
    isLikelyIHerbRetailUrl(targetUrl)
  ) {
    return wrapDestinationWithAdmitadTatrck(targetUrl);
  }

  const admitadWId = process.env.NEXT_PUBLIC_ADMITAD_W_ID;
  const admitadCId = process.env.NEXT_PUBLIC_ADMITAD_C_ID;

  if (admitadWId && admitadCId) {
    if (product.iherb_url?.trim()) {
      return generateAdmitadDeeplink(product.iherb_url.trim());
    }
    return generateAdmitadSearchLink(title);
  }

  const camref = process.env.NEXT_PUBLIC_PARTNERIZE_CAMREF;
  if (camref) {
    if (product.iherb_url?.trim()) {
      return generatePartnerizeProductLink(product.iherb_url.trim(), camref);
    }
    return generatePartnerizeSearchLink(title, camref);
  }

  return targetUrl;
}
