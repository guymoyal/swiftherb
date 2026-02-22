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
  iherb_url?: string;
}

interface ChatResponse {
  content: string;
  products?: Product[];
  error?: string;
}

/**
 * Mock products for fallback when KV is empty
 * Matches common product names to mock product data
 */
const MOCK_PRODUCTS: Record<string, Product> = {
  "magnesium_glycinate": {
    id: "MAG001",
    title: "Doctor's Best Magnesium Glycinate",
    price: "$18.50",
    image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Magnesium",
    description: "High absorption magnesium to support muscle relaxation and sleep quality.",
    category: "Minerals",
    slug: "magnesium_glycinate",
  },
  "vitamin_d3": {
    id: "VITD001",
    title: "Now Foods Vitamin D3 5000 IU",
    price: "$7.99",
    image: "https://via.placeholder.com/300x300/3b82f6/ffffff?text=Vitamin+D3",
    description: "Supports bone health, immune function, and mood regulation.",
    category: "Vitamins",
    slug: "vitamin_d3",
  },
  "ashwagandha": {
    id: "ASH001",
    title: "Himalaya Ashwagandha Root Extract",
    price: "$12.99",
    image: "https://via.placeholder.com/300x300/059669/ffffff?text=Ashwagandha",
    description: "Adaptogenic herb that helps reduce stress and support adrenal health.",
    category: "Herbs & Botanicals",
    slug: "ashwagandha",
  },
  "omega_3_fish_oil": {
    id: "OMG001",
    title: "Nordic Naturals Ultimate Omega",
    price: "$24.99",
    image: "https://via.placeholder.com/300x300/0284c7/ffffff?text=Omega+3",
    description: "High-quality fish oil supporting heart, brain, and joint health.",
    category: "Omega-3 & Essential Fatty Acids",
    slug: "omega_3_fish_oil",
  },
  "probiotics": {
    id: "PRO001",
    title: "Garden of Life Dr. Formulated Probiotics",
    price: "$29.99",
    image: "https://via.placeholder.com/300x300/7c3aed/ffffff?text=Probiotics",
    description: "50 billion CFU probiotic blend for digestive and immune health.",
    category: "Probiotics",
    slug: "probiotics",
  },
  "l_theanine": {
    id: "LTH001",
    title: "Now Foods L-Theanine 200mg",
    price: "$9.99",
    image: "https://via.placeholder.com/300x300/10b981/ffffff?text=L-Theanine",
    description: "Promotes relaxation and focus without drowsiness.",
    category: "Amino Acids",
    slug: "l_theanine",
  },
  "rhodiola_rosea": {
    id: "RHO001",
    title: "Gaia Herbs Rhodiola Rosea",
    price: "$19.99",
    image: "https://via.placeholder.com/300x300/059669/ffffff?text=Rhodiola",
    description: "Adaptogenic herb that supports energy, endurance, and stress response.",
    category: "Herbs & Botanicals",
    slug: "rhodiola_rosea",
  },
  "turmeric_curcumin": {
    id: "TUR001",
    title: "Qunol Turmeric Curcumin Complex",
    price: "$16.99",
    image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=Turmeric",
    description: "Anti-inflammatory support for joint health and overall wellness.",
    category: "Herbs & Botanicals",
    slug: "turmeric_curcumin",
  },
  "msm": {
    id: "MSM001",
    title: "Doctor's Best MSM",
    price: "$14.99",
    image: "https://via.placeholder.com/300x300/0284c7/ffffff?text=MSM",
    description: "Sulfur compound supporting joint health and connective tissue repair.",
    category: "Joint Support",
    slug: "msm",
  },
  "boswellia_serrata": {
    id: "BOS001",
    title: "Now Foods Boswellia Extract",
    price: "$18.99",
    image: "https://via.placeholder.com/300x300/059669/ffffff?text=Boswellia",
    description: "Supports joint comfort and mobility.",
    category: "Herbs & Botanicals",
    slug: "boswellia_serrata",
  },
  "glucosamine_chondroitin": {
    id: "GLC001",
    title: "Doctor's Best Glucosamine Chondroitin MSM",
    price: "$22.99",
    image: "https://via.placeholder.com/300x300/0284c7/ffffff?text=Glucosamine",
    description: "Supports joint health, flexibility, and mobility.",
    category: "Joint Support",
    slug: "glucosamine_chondroitin",
  },
  "devils_claw": {
    id: "DEV001",
    title: "Nature's Way Devil's Claw",
    price: "$11.99",
    image: "https://via.placeholder.com/300x300/059669/ffffff?text=Devils+Claw",
    description: "Traditional herb supporting joint comfort and mobility.",
    category: "Herbs & Botanicals",
    slug: "devils_claw",
  },
  "white_willow_bark": {
    id: "WHI001",
    title: "Nature's Way White Willow Bark",
    price: "$9.99",
    image: "https://via.placeholder.com/300x300/059669/ffffff?text=Willow+Bark",
    description: "Natural anti-inflammatory supporting comfort and wellness.",
    category: "Herbs & Botanicals",
    slug: "white_willow_bark",
  },
  "ginger": {
    id: "GIN003",
    title: "Nature's Way Ginger Root",
    price: "$7.99",
    image: "https://images.iherb.com/m/NAT-00009-5.jpg",
    description: "Supports digestive comfort and nausea relief.",
    category: "Digestive Health",
    slug: "ginger",
  },
};

/**
 * Matches product names from AI response to mock products
 */
function matchProductsToMock(productNames: string[]): Product[] {
  const matched: Product[] = [];
  const seenIds = new Set<string>();

  for (const name of productNames) {
    // Normalize: remove special chars, convert to lowercase, replace spaces with underscores
    const normalized = name.toLowerCase()
      .replace(/['"]/g, "") // Remove quotes
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+(extract|root|extract|complex|with|and)\s+/gi, " ") // Remove common suffixes
      .replace(/\s+/g, "_")
      .trim();
    
    // Try exact match first
    if (MOCK_PRODUCTS[normalized] && !seenIds.has(MOCK_PRODUCTS[normalized].id)) {
      const product = { ...MOCK_PRODUCTS[normalized] };
      product.iherb_url = `https://www.iherb.com/search?kw=${encodeURIComponent(product.title)}`;
      matched.push(product);
      seenIds.add(product.id);
      continue;
    }

    // Try fuzzy matching - extract key words from name
    const nameWords = name.toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !['extract', 'root', 'complex', 'with', 'and', 'the'].includes(w));

    let bestMatch: Product | null = null;
    let bestScore = 0;

    for (const [key, product] of Object.entries(MOCK_PRODUCTS)) {
      if (seenIds.has(product.id)) continue;
      
      const productTitleLower = product.title.toLowerCase();
      const keyLower = key.toLowerCase();
      
      // Calculate match score
      let score = 0;
      
      // Check if key words match
      for (const word of nameWords) {
        if (keyLower.includes(word) || productTitleLower.includes(word)) {
          score += 1;
        }
      }
      
      // Bonus for key match
      if (keyLower.includes(normalized) || normalized.includes(keyLower)) {
        score += 2;
      }
      
      // Bonus for title match
      if (productTitleLower.includes(name.toLowerCase()) || name.toLowerCase().includes(productTitleLower.split(' ')[0])) {
        score += 3;
      }
      
      if (score > bestScore && score > 0) {
        bestScore = score;
        bestMatch = product;
      }
    }

    if (bestMatch && !seenIds.has(bestMatch.id)) {
      const matchedProduct = { ...bestMatch };
      matchedProduct.iherb_url = `https://www.iherb.com/search?kw=${encodeURIComponent(bestMatch.title)}`;
      matched.push(matchedProduct);
      seenIds.add(bestMatch.id);
    }
  }

  return matched;
}

/**
 * System prompt for SwiftHerb AI assistant
 */
const SYSTEM_PROMPT = `You are SwiftHerb AI, a clinical pharmacist assistant specializing in natural supplements and wellness products available on iHerb.

CRITICAL INSTRUCTIONS:
1. **Persona:** Analytical, safe, fast, and helpful. You provide evidence-based supplement recommendations.
2. **Response Format:** Keep responses SHORT and MINIMAL. Do NOT provide long explanations or numbered lists.
3. **Product Recommendations:** For EVERY user query, you MUST suggest 5-10 specific products from iHerb. Wrap each product name in [[Double Brackets]].
4. **Format Example:** "I recommend: [[Magnesium Glycinate]], [[Ashwagandha Root Extract]], [[L-Theanine]], [[Omega-3 Fish Oil]], [[Vitamin D3]], [[Probiotics]], [[Rhodiola Rosea]], [[Passionflower Extract]], [[B-Complex Vitamins]], and [[Magnesium Citrate]]."
5. **Behavior:** Analyze the user's symptoms/concerns -> Identify relevant supplement categories -> Suggest 5-10 specific products that address their needs. NO explanations, NO numbered lists, NO detailed descriptions.
6. **Safety:** If a user mentions chest pain, difficulty breathing, or suicidal thoughts, STOP immediately and give an IMMEDIATE emergency warning directing them to call 911 or seek emergency medical care.
7. **Wellness Stacks:** Always suggest multiple products (5-10) that work synergistically. DO NOT explain why each product helps - just list them.
8. **Product Names:** Use common, searchable product names that exist on iHerb (e.g., "Magnesium Glycinate", "Vitamin D3", "Omega-3 Fish Oil", "Probiotics", "Ashwagandha", etc.).
9. **Keep it Brief:** Maximum 2-3 sentences. Focus on listing products in double brackets, not explaining them.`;

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
      if (productNames.length > 0) {
        console.log(`[Chat API] Extracted ${productNames.length} product names:`, productNames);
        
        // Try KV first
        if (env.PRODUCTS) {
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
          console.log(`[Chat API] Found ${products.length} products in KV`);
        }

        // Fallback to mock products if KV is empty or unavailable
        if (!products || products.length === 0) {
          console.log(`[Chat API] Using mock products fallback`);
          products = matchProductsToMock(productNames);
          console.log(`[Chat API] Matched ${products.length} mock products`);
        } else {
          // Ensure iherb_url is set for KV products
          products = products.map(p => ({
            ...p,
            iherb_url: p.iherb_url || `https://www.iherb.com/search?kw=${encodeURIComponent(p.title)}`
          }));
        }
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
