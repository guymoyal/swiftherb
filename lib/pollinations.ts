/**
 * Pollinations.ai – free image generation, no API key.
 * URL-based: https://image.pollinations.ai/prompt/{prompt}?width=800&height=400&nologo=true
 * Use for article featured images with content-relevant prompts.
 */

const BASE = "https://image.pollinations.ai/prompt";

/**
 * Build a short, URL-safe prompt from article title and category
 * so generated images are relevant to the content.
 */
export function buildArticleImagePrompt(title: string, category: string): string {
  // Use title + category; strip colon/suffix and take first meaningful part
  const combined = `${title} ${category}`.toLowerCase();
  // Remove common prefixes/suffixes and keep topic words
  const cleaned = combined
    .replace(/\b(signs|symptoms|and|the|for|guide|best|how to|what|why|benefits|complete)\b/gi, "")
    .replace(/[:\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const topic = (cleaned || title).slice(0, 80);
  return `professional health and wellness article image about ${topic} clean modern style`;
}

/**
 * Turn a text prompt into the path segment for Pollinations (underscores, no special chars).
 */
function toPathSegment(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "") || "health_wellness_article";
}

/**
 * Get Pollinations.ai image URL for an article (free, no key).
 * Image is generated from a content-relevant prompt.
 */
export function getPollinationsArticleImageUrl(
  title: string,
  category: string,
  options: { width?: number; height?: number; nologo?: boolean } = {}
): string {
  const prompt = buildArticleImagePrompt(title, category);
  const segment = toPathSegment(prompt);
  const width = options.width ?? 800;
  const height = options.height ?? 400;
  const nologo = options.nologo !== false;
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    ...(nologo && { nologo: "true" }),
  });
  return `${BASE}/${segment}?${params.toString()}`;
}
