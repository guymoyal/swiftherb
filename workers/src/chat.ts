/**
 * Cloudflare Worker for SwiftHerb Chat API
 * Handles AI chat requests and product suggestions
 */

export interface Env {
  // KV Namespace binding
  PRODUCTS: KVNamespace;
  
  // Environment variables
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_API_URL?: string;
  DEEPSEEK_MODEL?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: Message[];
  userMessage: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  category: string;
  slug: string;
}

interface ChatResponse {
  content: string;
  products?: Product[];
  error?: string;
}

/**
 * System prompt for SwiftHerb AI assistant
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
 * Main chat API handler
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    try {
      const body: ChatRequest = await request.json();
      const { messages, userMessage } = body;

      // Validate input
      if (!userMessage || typeof userMessage !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid message format" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

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
        return new Response(
          JSON.stringify({
            content:
              "⚠️ EMERGENCY WARNING: This sounds like a medical emergency. Please call 911 or go to your nearest emergency room immediately. This is not something I can help with through this platform.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Call DeepSeek API
      const apiKey = env.DEEPSEEK_API_KEY;
      const apiUrl = env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";
      const model = env.DEEPSEEK_MODEL || "deepseek-chat";

      if (!apiKey) {
        return new Response(
          JSON.stringify({
            content:
              "I understand you're asking about health concerns. To provide accurate recommendations, please configure the DEEPSEEK_API_KEY environment variable.",
            error: "API key not configured",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Call DeepSeek API
      const aiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...(messages || []),
            { role: "user", content: userMessage },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        throw new Error(`AI API error: ${aiResponse.status} ${errorText}`);
      }

      const aiData = await aiResponse.json();
      const aiContent = aiData.choices?.[0]?.message?.content || "";

      // Extract product names from AI response
      const productMatches = aiContent.match(/\[\[([^\]]+)\]\]/g) || [];
      const productNames = productMatches.map((match: string) =>
        match.replace(/\[\[|\]\]/g, "")
      );

      // Fetch product metadata from KV if products are mentioned
      let products: Product[] | undefined = undefined;
      if (productNames.length > 0 && env.PRODUCTS) {
        const productSlugs = productNames.map((name: string) =>
          name.toLowerCase().replace(/[^a-z0-9_]+/g, "_")
        );

        // Batch fetch from KV
        const productPromises = productSlugs.map((slug: string) => {
          const key = `prod_${slug}`;
          return env.PRODUCTS.get(key, "json");
        });

        const fetchedProducts = await Promise.all(productPromises);
        products = fetchedProducts.filter((p) => p !== null) as Product[];
      }

      const response: ChatResponse = {
        content: aiContent,
        products,
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Chat API error:", error);
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Internal server error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  },
};
