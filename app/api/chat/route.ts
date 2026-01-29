import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { getProductsFromKV } from "@/lib/kv";
import { handleError } from "@/lib/error-handler";

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

    return NextResponse.json({
      content: aiResponse.content,
      products,
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
