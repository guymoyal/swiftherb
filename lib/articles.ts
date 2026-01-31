/**
 * Articles loader utility
 * Loads article content from JSON files
 */

import articlesData from "@/data/articles.json";

export interface ArticleAuthor {
  name: string;
  bio: string;
  avatar: string;
}

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: ArticleAuthor;
  publishedDate: string;
  lastUpdated?: string;
  category: string;
  tags: string[];
  readTime: string;
  featuredImage: string;
  sections: ArticleSection[];
  relatedProducts: string[];
  relatedArticles: string[];
}

/**
 * Gets all articles
 * 
 * @returns Array of all articles
 */
export function getAllArticles(): Article[] {
  const data = articlesData as Record<string, Article>;
  return Object.values(data);
}

/**
 * Gets article by slug
 * 
 * @param slug - Article slug
 * @returns Article or null if not found
 */
export function getArticleBySlug(slug: string): Article | null {
  const data = articlesData as Record<string, Article>;
  return data[slug] || null;
}

/**
 * Gets articles by category
 * 
 * @param category - Article category
 * @returns Array of articles in category
 */
export function getArticlesByCategory(category: string): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.category === category);
}

/**
 * Gets articles by tag
 * 
 * @param tag - Article tag
 * @returns Array of articles with tag
 */
export function getArticlesByTag(tag: string): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.tags.includes(tag));
}

/**
 * Gets featured articles (can be customized)
 * 
 * @param limit - Maximum number of articles to return
 * @returns Array of featured articles
 */
export function getFeaturedArticles(limit: number = 3): Article[] {
  const allArticles = getAllArticles();
  // For now, return most recent articles
  return allArticles
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}

/**
 * Gets related articles
 * 
 * @param currentSlug - Current article slug
 * @param limit - Maximum number of articles to return
 * @returns Array of related articles
 */
export function getRelatedArticles(currentSlug: string, limit: number = 3): Article[] {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return [];

  const allArticles = getAllArticles();
  const relatedSlugs = currentArticle.relatedArticles || [];
  
  return allArticles
    .filter(article => 
      article.slug !== currentSlug && 
      relatedSlugs.includes(article.slug)
    )
    .slice(0, limit);
}

/**
 * Gets all unique categories
 * 
 * @returns Array of unique category names
 */
export function getAllCategories(): string[] {
  const allArticles = getAllArticles();
  const categories = new Set(allArticles.map(article => article.category));
  return Array.from(categories).sort();
}

/**
 * Gets all unique tags
 * 
 * @returns Array of unique tag names
 */
export function getAllTags(): string[] {
  const allArticles = getAllArticles();
  const tags = new Set<string>();
  allArticles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}
