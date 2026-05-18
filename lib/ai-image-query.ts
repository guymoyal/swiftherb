/**
 * Use AI (DeepSeek) to generate a relevant image search query from article content.
 * This ensures the chosen image matches the article topic.
 */

export interface ArticleForImage {
  title: string;
  excerpt: string;
  category: string;
}

const PROMPT = `You are an expert at choosing stock photo search queries for health and wellness articles.

Given an article's title, short excerpt, and category, output ONLY a short Unsplash-style search query (3-6 English words) that would find a relevant, professional stock photo for the article. No quotes, no explanation, no punctuation at the end.

Examples:
- "Magnesium Deficiency: Signs, Symptoms" + minerals → magnesium supplements minerals health
- "Omega-3 Benefits: Fish Oil Guide" + Omega-3 → fish oil capsules omega 3 supplements
- "Probiotics for Gut Health" + Probiotics → probiotics gut health digestion

Output only the search query, nothing else.`;

/**
 * Calls DeepSeek to generate an image search query that matches the article.
 * Returns null if AI is not configured or fails.
 */
export async function getArticleImageSearchQuery(
  article: ArticleForImage
): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl =
    process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  if (!apiKey) {
    return null;
  }

  const userMessage = `Title: ${article.title}\nCategory: ${article.category}\nExcerpt: ${article.excerpt}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      console.warn("AI image query API error:", response.status);
      return null;
    }

    const data = await response.json();
    const content =
      data.choices?.[0]?.message?.content?.trim?.() || null;
    if (!content) return null;

    // Take first line and clean (in case AI added explanation)
    const query = content.split("\n")[0].replace(/^["']|["']$/g, "").trim();
    return query.length > 0 ? query : null;
  } catch (error) {
    console.warn("AI image query error:", error);
    return null;
  }
}
