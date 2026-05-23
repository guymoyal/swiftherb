/**
 * Admitad “tatrck” redirect base (publisher tracking) — wraps the final iHerb URL in `?url=`.
 * Default matches your Admitad link; override with NEXT_PUBLIC_ADMITAD_TATRCK_BASE.
 * Set NEXT_PUBLIC_ADMITAD_TATRCK_DISABLED=true to turn off and fall back to API deeplink / Partnerize / plain.
 */
export const DEFAULT_ADMITAD_TATRCK_BASE = "https://tatrck.com/h/0Jm30_BU0dp3";

export function isAdmitadTatrckWrappingEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ADMITAD_TATRCK_DISABLED === "true") return false;
  return true;
}

export function getAdmitadTatrckBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_ADMITAD_TATRCK_BASE?.trim() || DEFAULT_ADMITAD_TATRCK_BASE;
  return raw.replace(/\/+$/, "");
}

/** True for www.iherb.com, iherb.com, and regional iHerb hosts. */
export function isLikelyIHerbRetailUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "iherb.com" || host.endsWith(".iherb.com");
  } catch {
    return false;
  }
}

export function isAdmitadTatrckUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "tatrck.com" || host.endsWith(".tatrck.com");
  } catch {
    return false;
  }
}

/**
 * Wrap a destination iHerb URL in Admitad tatrck (same pattern as
 * https://tatrck.com/h/0Jm30_BU0dp3?url=https://www.iherb.com/... ).
 */
export function wrapDestinationWithAdmitadTatrck(destinationUrl: string): string {
  const base = getAdmitadTatrckBase();
  return `${base}?url=${encodeURIComponent(destinationUrl)}`;
}

/**
 * Generates an Admitad deep link for iHerb products
 * Documentation: https://www.admitad.com/en/developers/doc/api_en/
 * 
 * @param productUrl - Direct URL to the product on iHerb.com
 * @returns Admitad affiliate link
 */
export function generateAdmitadDeeplink(productUrl: string): string {
  const wId = process.env.NEXT_PUBLIC_ADMITAD_W_ID || process.env.ADMITAD_W_ID;
  const cId = process.env.NEXT_PUBLIC_ADMITAD_C_ID || process.env.ADMITAD_C_ID;
  
  if (!wId || !cId) {
    console.warn("Admitad W_ID or C_ID not configured, returning original URL");
    return productUrl;
  }
  
  // Encode the product URL
  const encodedUrl = encodeURIComponent(productUrl);
  
  // Generate deeplink
  // Format: https://api.admitad.com/deeplink/{w_id}/advcampaign/{c_id}/?ulp={product_url}
  return `https://api.admitad.com/deeplink/${wId}/advcampaign/${cId}/?ulp=${encodedUrl}`;
}

/**
 * Generates an Admitad search link (fallback if product URL not available)
 * @param keyword - Product name or search keyword
 * @returns Admitad affiliate link for search
 */
export function generateAdmitadSearchLink(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  const wId = process.env.NEXT_PUBLIC_ADMITAD_W_ID || process.env.ADMITAD_W_ID;
  const cId = process.env.NEXT_PUBLIC_ADMITAD_C_ID || process.env.ADMITAD_C_ID;
  
  if (!wId || !cId) {
    console.warn("Admitad W_ID or C_ID not configured, returning iHerb search URL");
    return `https://www.iherb.com/search?kw=${encoded}`;
  }
  
  // Create search URL first, then convert to deeplink
  const searchUrl = `https://www.iherb.com/search?kw=${encoded}`;
  return generateAdmitadDeeplink(searchUrl);
}
