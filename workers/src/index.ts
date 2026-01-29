/**
 * Cloudflare Worker for SwiftHerb API
 * Handles product data retrieval from KV store
 */

export interface Env {
  // KV Namespace binding (will be configured in wrangler.toml)
  PRODUCTS: KVNamespace;
  
  // Environment variables
  ENVIRONMENT: string;
}

/**
 * Product data structure matching the KV schema
 */
export interface KVProduct {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  category: string;
  slug: string;
  iherb_url?: string;
}

/**
 * API Response types
 */
interface ProductResponse {
  success: boolean;
  data?: KVProduct | KVProduct[];
  error?: string;
}

/**
 * Main request handler
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route: GET /products/:slug
      if (path.startsWith("/products/") && request.method === "GET") {
        const slug = path.split("/products/")[1];
        return handleGetProduct(slug, env, corsHeaders);
      }

      // Route: POST /products/batch
      if (path === "/products/batch" && request.method === "POST") {
        return handleGetProductsBatch(request, env, corsHeaders);
      }

      // Route: GET /products/search?q=query
      if (path === "/products/search" && request.method === "GET") {
        const query = url.searchParams.get("q");
        return handleSearchProducts(query || "", env, corsHeaders);
      }

      // Health check
      if (path === "/health") {
        return new Response(
          JSON.stringify({ status: "ok", service: "swiftherb-api" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(
        JSON.stringify({
          success: false,
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

/**
 * Get a single product by slug
 */
async function handleGetProduct(
  slug: string,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (!env.PRODUCTS) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "KV namespace not configured",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const key = `prod_${slug}`;
  const product = await env.PRODUCTS.get(key, "json");

  if (!product) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Product not found",
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: product,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Get multiple products by slugs (batch request)
 */
async function handleGetProductsBatch(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (!env.PRODUCTS) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "KV namespace not configured",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await request.json();
    const { slugs } = body;

    if (!Array.isArray(slugs)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request: slugs must be an array",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch all products in parallel
    const productPromises = slugs.map((slug: string) => {
      const key = `prod_${slug}`;
      return env.PRODUCTS.get(key, "json");
    });

    const products = await Promise.all(productPromises);
    const validProducts = products.filter((p) => p !== null);

    return new Response(
      JSON.stringify({
        success: true,
        data: validProducts,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid JSON in request body",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Search products by query
 * Note: KV doesn't support full-text search, so this is a simple prefix match
 * For production, consider using Cloudflare D1 or external search service
 */
async function handleSearchProducts(
  query: string,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (!env.PRODUCTS) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "KV namespace not configured",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // KV doesn't support search, so we'd need to maintain an index
  // For now, return empty results with a note
  return new Response(
    JSON.stringify({
      success: true,
      data: [],
      message: "Search functionality requires product index. Use batch endpoint with known slugs.",
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}
