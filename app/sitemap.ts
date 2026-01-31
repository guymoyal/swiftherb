import { MetadataRoute } from "next";
import { getSitemapUrls } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = getSitemapUrls();
  
  return urls.map((url) => ({
    url: url.loc,
    lastModified: url.lastmod,
    changeFrequency: url.changefreq as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: parseFloat(url.priority),
  }));
}
