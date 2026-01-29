/**
 * Content loader utility
 * Loads page content from JSON files
 */

import pagesData from "@/data/pages.json";

export interface PageSection {
  heading: string;
  content: string;
}

export interface PageContent {
  title: string;
  lastUpdated?: string;
  sections: PageSection[];
}

/**
 * Gets page content from JSON data
 * 
 * @param pageId - Page identifier (privacy, terms, about)
 * @returns Page content or null if not found
 */
export function getPageContent(pageId: string): PageContent | null {
  const data = pagesData as Record<string, PageContent>;
  return data[pageId] || null;
}

/**
 * Formats content text with line breaks
 * 
 * @param content - Content string with \n separators
 * @returns Array of paragraphs
 */
export function formatContent(content: string): string[] {
  return content.split("\n").filter((line) => line.trim().length > 0);
}
