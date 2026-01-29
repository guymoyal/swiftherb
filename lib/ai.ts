import { Product } from "@/components/ChatInterface";
import { cache, SimpleCache } from "./cache";

/**
 * System prompt for SwiftHerb AI assistant
 * Configures the AI to act as a clinical pharmacist assistant with specific product recommendation requirements
 */
const SYSTEM_PROMPT = `You are SwiftHerb AI, a clinical pharmacist assistant specializing in natural supplements and wellness products available on iHerb.

CRITICAL INSTRUCTIONS:
1. **Persona:** Analytical, safe, fast, and helpful. You provide evidence-based supplement recommendations.
2. **Product Recommendations:** For EVERY user query, you MUST suggest 5-10 specific products from iHerb. Wrap each product name in [[Double Brackets]].
3. **Format Example:** "Based on your concern about anxiety, I recommend this wellness stack: [[Magnesium Glycinate]], [[Ashwagandha Root Extract]], [[L-Theanine]], [[Omega-3 Fish Oil]], [[Vitamin D3]], [[Probiotics]], [[Rhodiola Rosea]], [[Passionflower Extract]], [[B-Complex Vitamins]], and [[Magnesium Citrate]]."
4. **Behavior:** Analyze the user's symptoms/concerns -> Identify relevant supplement categories -> Suggest 5-10 specific products that address their needs.
5. **Safety:** If a user mentions chest pain, difficulty breathing, or suicidal thoughts, STOP immediately and give an IMMEDIATE emergency warning directing them to call 911 or seek emergency medical care.
6. **Wellness Stacks:** Always suggest multiple products (5-10) that work synergistically. Explain briefly why each product helps.
7. **Product Names:** Use common, searchable product names that exist on iHerb (e.g., "Magnesium Glycinate", "Vitamin D3", "Omega-3 Fish Oil", "Probiotics", "Ashwagandha", etc.).`;

/**
 * Response structure from AI API call
 */
export interface AIResponse {
  /** The text content of the AI response */
  content: string;
  /** Array of recommended products (populated from KV store) */
  products?: Product[];
}

/**
 * Calls the DeepSeek API to generate a response
 * Includes retry logic, error handling, and emergency keyword detection
 * 
 * @param messages - Array of previous conversation messages
 * @param userMessage - The current user message to respond to
 * @returns Promise resolving to AIResponse with content and products
 * 
 * @example
 * ```typescript
 * const response = await callAI(
 *   [{ role: "user", content: "Help with anxiety" }],
 *   "What supplements help?"
 * );
 * ```
 */
export async function callAI(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string
): Promise<AIResponse> {
  // Check for emergency keywords
  const emergencyKeywords = [
    "chest pain",
    "difficulty breathing",
    "can't breathe",
    "suicidal",
    "kill myself",
    "want to die",
  ];
  const lowerMessage = userMessage.toLowerCase();
  
  if (emergencyKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return {
      content:
        "⚠️ EMERGENCY WARNING: This sounds like a medical emergency. Please call 911 or go to your nearest emergency room immediately. This is not something I can help with through this platform.",
    };
  }

  // Check cache first (skip caching for emergency responses)
  const cacheKey = SimpleCache.generateKey(messages, userMessage);
  const cachedResponse = cache.get<AIResponse>(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Use DeepSeek API directly
  // DeepSeek uses OpenAI-compatible API
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  if (!apiKey) {
    // Fallback response for development
    return {
      content:
        "I understand you're asking about health concerns. To provide accurate recommendations, please configure the DEEPSEEK_API_KEY environment variable. Get your API key at https://platform.deepseek.com. For now, I'd suggest looking into [[Magnesium Glycinate]] for general wellness support.",
    };
  }

  // Retry logic for API calls
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
            { role: "user", content: userMessage },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        let errorMessage = `AI API error: ${apiResponse.status} ${apiResponse.statusText}`;
        
        // Provide user-friendly error messages
        if (apiResponse.status === 401) {
          errorMessage = "API authentication failed. Please check your API key.";
        } else if (apiResponse.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again in a moment.";
        } else if (apiResponse.status >= 500) {
          errorMessage = "AI service is temporarily unavailable. Please try again.";
        }
        
        throw new Error(errorMessage);
      }

      const data = await apiResponse.json();
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response format from AI service");
      }

      const aiContent = data.choices[0]?.message?.content || "";

      // Extract product names from double brackets
      const productMatches = aiContent.match(/\[\[([^\]]+)\]\]/g) || [];
      const productNames = productMatches.map((match: string) =>
        match.replace(/\[\[|\]\]/g, "")
      );

      // TODO: Query Cloudflare KV for product metadata
      // For now, return the response without product metadata
      const aiResponse: AIResponse = {
        content: aiContent,
        products: productNames.length > 0 ? undefined : undefined, // Will be populated from KV
      };

      // Cache the response for 5 minutes
      cache.set(cacheKey, aiResponse, 5 * 60 * 1000);

      return aiResponse;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on authentication errors
      if (lastError.message.includes("authentication") || lastError.message.includes("401")) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // All retries failed
  console.error("AI API error after retries:", lastError);
  return {
    content: lastError?.message.includes("authentication")
      ? "⚠️ Configuration Error: Please check your API key configuration. The AI service cannot be accessed."
      : lastError?.message.includes("Rate limit")
      ? "⚠️ Rate Limit: Too many requests. Please wait a moment and try again."
      : "I apologize, but I'm experiencing technical difficulties. Please try again in a moment. If the problem persists, check your API configuration.",
  };
}
