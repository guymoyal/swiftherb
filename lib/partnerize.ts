/**
 * Partnerize deep links for iHerb (prf.hn).
 * Use when Admitad is unavailable — set NEXT_PUBLIC_PARTNERIZE_CAMREF from Partnerize dashboard.
 */

function destinationUrlForSearch(keyword: string): string {
  const kw = encodeURIComponent(keyword);
  return `https://www.iherb.com/search?kw=${kw}`;
}

/**
 * Wrap any HTTPS destination in a Partnerize click URL.
 * Format: https://prf.hn/click/camref:{camref}/destination:{encodeURIComponent(destination)}
 */
export function generatePartnerizeDeeplink(destination: string, camref: string): string {
  const encoded = encodeURIComponent(destination);
  return `https://prf.hn/click/camref:${camref}/destination:${encoded}`;
}

export function generatePartnerizeProductLink(productUrl: string, camref: string): string {
  return generatePartnerizeDeeplink(productUrl, camref);
}

export function generatePartnerizeSearchLink(keyword: string, camref: string): string {
  return generatePartnerizeDeeplink(destinationUrlForSearch(keyword), camref);
}
