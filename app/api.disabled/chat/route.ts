import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getProductsFromKV } from "@/lib/kv";
import { handleError } from "@/lib/error-handler";
import { suggestComplementaryProducts, findBundlesWithProducts } from "@/lib/bundles";

export async function POST(request: NextRequest) {
  try {
    const { messages, userMessage } = await request.json();

    // Validate input
    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // Call AI to get response
    const aiResponse = await callAI(messages || [], userMessage);

    // Extract product names from AI response
    const productMatches = aiResponse.content.match(/\[\[([^\]]+)\]\]/g) || [];
    const productNames = productMatches.map((match) =>
      match.replace(/\[\[|\]\]/g, "")
    );

    // Fetch product metadata from KV if products are mentioned
    let products = undefined;
    if (productNames.length > 0) {
      products = await getProductsFromKV(productNames);
    }

    // Check if user is asking about bundles or completing their stack
    const lowerMessage = userMessage.toLowerCase();
    const isBundleQuery = 
      lowerMessage.includes("bundle") ||
      lowerMessage.includes("complete my stack") ||
      lowerMessage.includes("complete your stack") ||
      lowerMessage.includes("what else should i add");

    // If bundle query and we have products, suggest complementary products
    let bundleSuggestions = undefined;
    if (isBundleQuery && products && products.length > 0) {
      const productSlugs = products.map(p => 
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")
      );
      const complementarySlugs = suggestComplementaryProducts(productSlugs);
      if (complementarySlugs.length > 0) {
        bundleSuggestions = await getProductsFromKV(complementarySlugs);
      }
    }

    return NextResponse.json({
      content: aiResponse.content,
      products,
      bundleSuggestions, // Additional products for bundle/stack completion
    });
  } catch (error) {
    const errorMessage = handleError(error, {
      endpoint: "/api/chat",
      timestamp: Date.now(),
    });

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
