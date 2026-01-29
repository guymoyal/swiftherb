/**
 * Generates a Partnerize deep link for iHerb products
 * @param keyword - Product name or search keyword
 * @returns Partnerize affiliate link
 */
export function generateLink(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  const camref = process.env.NEXT_PUBLIC_PARTNERIZE_CAMREF || "YOUR_CAMREF";
  return `https://prf.hn/click/camref:${camref}/destination:https://www.iherb.com/search?kw=${encoded}`;
}
