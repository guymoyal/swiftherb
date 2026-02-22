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
