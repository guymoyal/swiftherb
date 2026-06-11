import { MetadataRoute } from "next";

export const dynamic = "force-static";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";

/**
 * Robots: broad allow for search + AI/answer crawlers (AEO-friendly).
 * Keep disallow list minimal—only non-content or non-stable paths.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/api.disabled/", "/go/"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site.replace(/^https?:\/\//, ""),
  };
}
