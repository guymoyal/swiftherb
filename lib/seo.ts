/**
 * SEO utilities and structured data generators
 */

import { getAllArticles } from "./articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";
const SITE_NAME = "SwiftHerb";
const SITE_DESCRIPTION = "AI-powered supplement recommendation platform. Get personalized natural health product recommendations from our AI pharmacist assistant.";

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
    sameAs: [
      // Add social media links when available
    ],
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
      loc: `${SITE_URL}/about`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
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
    ...articles.map((article) => ({
      loc: `${SITE_URL}/articles/${article.slug}`,
      lastmod: article.lastUpdated || article.publishedDate,
      changefreq: "monthly",
      priority: "0.8",
    })),
  ];
  
  return urls;
}
