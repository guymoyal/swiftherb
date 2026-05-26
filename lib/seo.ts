/**
 * SEO utilities and structured data generators
 */

import { getAllArticles } from "./articles";
import { getCatalogCategories } from "./catalog";
import { getAllBrandSlugs } from "./brands";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";
const SITE_NAME = "SwiftHerb";
const SITE_DESCRIPTION =
  "SwiftHerb is a small site that helps you narrow supplement choices on iHerb. You get short catalog pages, optional brand writeups, and a chat assistant. We are not medical professionals; always read the real product page before you buy.";

/**
 * Organization structured data
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/swiftherb-logo.png`,
    description: SITE_DESCRIPTION,
    knowsAbout: [
      "Dietary supplements",
      "Vitamins",
      "Minerals",
      "Herbal supplements",
      "Online health retail",
    ],
    areaServed: {
      "@type": "Place",
      name: "Worldwide where iHerb delivers",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact/`,
      availableLanguage: ["English"],
    },
    sameAs: [] as string[],
  };
}

/**
 * WebSite structured data
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/swiftherb-logo.png`,
      },
    },
    inLanguage: "en-US",
  };
}

/**
 * Article structured data
 */
export function getArticleSchema(article: {
  title: string;
  slug: string;
  excerpt: string;
  publishedDate: string;
  lastUpdated?: string;
  featuredImage: string;
  author: { name: string; bio: string };
  category: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedDate,
    dateModified: article.lastUpdated || article.publishedDate,
    author: {
      "@type": "Person",
      name: article.author.name,
      description: article.author.bio,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/swiftherb-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags.join(", "),
  };
}

/**
 * FAQPage structured data
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList structured data
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Product structured data (for product recommendations)
 */
export function getProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: string;
  url: string;
  brand?: string;
  sku?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand ? {
      "@type": "Brand",
      name: product.brand,
    } : undefined,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: product.url,
    },
  };
}

/**
 * Generate sitemap URLs
 */
export function getSitemapUrls() {
  const articles = getAllArticles();
  const today = new Date().toISOString().split("T")[0];
  
  const urls = [
    {
      loc: SITE_URL,
      lastmod: today,
      changefreq: "daily",
      priority: "1.0",
    },
    {
      loc: `${SITE_URL}/articles`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      loc: `${SITE_URL}/catalog`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.85",
    },
    {
      loc: `${SITE_URL}/compare`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.55",
    },
    {
      loc: `${SITE_URL}/contact`,
      lastmod: today,
      changefreq: "yearly",
      priority: "0.45",
    },
    {
      loc: `${SITE_URL}/faq`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      loc: `${SITE_URL}/how-it-works`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.72",
    },
    {
      loc: `${SITE_URL}/affiliate-disclosure`,
      lastmod: today,
      changefreq: "yearly",
      priority: "0.5",
    },
    {
      loc: `${SITE_URL}/reviews`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.72",
    },
    ...getAllBrandSlugs().map((slug) => ({
      loc: `${SITE_URL}/reviews/${slug}`,
      lastmod: today,
      changefreq: "monthly" as const,
      priority: "0.65",
    })),
    {
      loc: `${SITE_URL}/llms.txt`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.35",
    },
    {
      loc: `${SITE_URL}/ai.txt`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.3",
    },
    {
      loc: `${SITE_URL}/about`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: `${SITE_URL}/editorial-standards`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.65",
    },
    {
      loc: `${SITE_URL}/privacy`,
      lastmod: today,
      changefreq: "yearly",
      priority: "0.5",
    },
    {
      loc: `${SITE_URL}/terms`,
      lastmod: today,
      changefreq: "yearly",
      priority: "0.5",
    },
    ...getCatalogCategories().map((c) => ({
      loc: `${SITE_URL}/catalog/${c.slug}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.75",
    })),
    ...articles.map((article) => ({
      loc: `${SITE_URL}/articles/${article.slug}`,
      lastmod: article.lastUpdated || article.publishedDate,
      changefreq: "monthly",
      priority: "0.8",
    })),
  ];
  
  return urls;
}
