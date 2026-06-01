/**
 * Scheduled Worker for SwiftHerb Product Updates
 * Runs every 2-4 hours to update product data from iHerb
 * 
 * Cron Schedule: Every 3 hours
 */

export interface Env {
  PRODUCTS: KVNamespace;
  ENVIRONMENT: string;
  /** Impact.com API (catalog sync when iHerb program is approved) */
  IMPACT_ACCOUNT_SID?: string;
  IMPACT_AUTH_TOKEN?: string;
  IHERB_API_KEY?: string;
}

interface ProductUpdate {
  slug: string;
  product: {
    id: string;
    title: string;
    price: string;
    image: string;
    description: string;
    category: string;
    slug: string;
    iherb_url?: string;
    updated_at: string;
  };
}

/**
 * Main update function - can be called from scheduled or HTTP handler
 */
async function updateProducts(env: Env): Promise<void> {
  console.log(`[${new Date().toISOString()}] Starting product update job`);
  
  try {
    // Fetch updated products from source
    const updates = await fetchProductUpdates(env);
    
    if (updates.length === 0) {
      console.log("No product updates found");
      return;
    }
    
    console.log(`Processing ${updates.length} product updates...`);
    
    // Log sample products (first 5) to see what we're fetching
    if (updates.length > 0) {
      console.log("\n=== SAMPLE PRODUCTS FETCHED ===");
      updates.slice(0, 5).forEach((update, idx) => {
        console.log(`\nProduct ${idx + 1}:`);
        console.log(`  ID: ${update.product.id}`);
        console.log(`  Title: ${update.product.title}`);
        console.log(`  Price: ${update.product.price}`);
        console.log(`  Category: ${update.product.category}`);
        console.log(`  Slug: ${update.slug}`);
        console.log(`  Image: ${update.product.image ? "Yes" : "No"}`);
        console.log(`  Description length: ${update.product.description?.length || 0} chars`);
      });
      if (updates.length > 5) {
        console.log(`\n... and ${updates.length - 5} more products`);
      }
      console.log("==============================\n");
    }
    
    // Batch update KV (1000 writes/second limit)
    const batchSize = 100;
    let updated = 0;
    let failed = 0;
    let unchanged = 0;
    
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      // Log batch progress
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(updates.length / batchSize)} (${batch.length} products)...`);
      
      // Update in parallel (up to batchSize)
      const results = await Promise.allSettled(
        batch.map(async (update) => {
          const key = `prod_${update.slug}`;
          const value = JSON.stringify(update.product);
          
          // Check if product exists and has changed
          const existing = await env.PRODUCTS.get(key, "json");
          if (existing && JSON.stringify(existing) === value) {
            return { slug: update.slug, status: "unchanged" };
          }
          
          // Store in KV
          await env.PRODUCTS.put(key, value);
          
          // Log first few KV writes as examples
          if (updated < 3) {
            console.log(`  ✓ Stored in KV: key="${key}", title="${update.product.title}"`);
          }
          
          return { slug: update.slug, status: "updated" };
        })
      );
      
      // Count results
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          if (result.value.status === "updated") {
            updated++;
          } else {
            unchanged++;
          }
        } else {
          failed++;
          console.error(`  ✗ Failed to update product:`, result.reason);
        }
      });
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < updates.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    
    console.log(
      `[${new Date().toISOString()}] Update complete: ${updated} updated, ${unchanged} unchanged, ${failed} failed`
    );
    
    // Log KV storage summary
    console.log("\n=== KV STORAGE SUMMARY ===");
    console.log(`Total products in KV: ${updated + unchanged} (${updated} new/updated, ${unchanged} unchanged)`);
    console.log(`KV Key format: prod_{slug}`);
    console.log(`Example keys: ${updates.slice(0, 3).map(u => `prod_${u.slug}`).join(", ")}`);
    console.log("==========================\n");
    
    // Optional: Send notification on errors
    if (failed > 0) {
      console.error(`Warning: ${failed} products failed to update`);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Update job failed:`, error);
    throw error; // Will trigger retry
  }
}

/**
 * Scheduled handler - runs on cron trigger
 */
export default {
  // HTTP handler for manual testing
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Only allow POST requests for manual triggers
    if (request.method !== "POST") {
      return new Response("Use POST to manually trigger product update", { status: 405 });
    }

    try {
      // Capture console logs for response
      const logs: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        originalLog(...args);
      };
      console.error = (...args: any[]) => {
        logs.push(`ERROR: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
        originalError(...args);
      };
      
      await updateProducts(env);
      
      // Restore console
      console.log = originalLog;
      console.error = originalError;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Product update completed",
          logs: logs.slice(-20) // Last 20 log lines
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },

  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    await updateProducts(env);
  },
};

/**
 * Fetch product updates (Impact catalog when configured; otherwise none).
 */
async function fetchProductUpdates(env: Env): Promise<ProductUpdate[]> {
  if (env.IMPACT_ACCOUNT_SID && env.IMPACT_AUTH_TOKEN) {
    console.log(
      "Impact credentials present — catalog sync via Impact API is not wired in this worker yet. Use scripts/probe-impact-catalog.ts or sync catalog JSON locally.",
    );
  }

  if (env.IHERB_API_KEY) {
    try {
      console.log("Attempting to fetch from iHerb API...");
      return await fetchFromIHerbAPI(env);
    } catch (error) {
      console.error("iHerb API failed:", error instanceof Error ? error.message : String(error));
    }
  }

  console.log(
    "No product feed configured. Catalog is served from data/catalog/products.json in the static site.",
  );
  return [];
}

/**
 * Fetch products from iHerb API (if they have one)
 */
async function fetchFromIHerbAPI(env: Env): Promise<ProductUpdate[]> {
  // TODO: Implement if iHerb provides an API
  const response = await fetch("https://api.iherb.com/products", {
    headers: {
      Authorization: `Bearer ${env.IHERB_API_KEY}`,
    },
  });
  
  const data = await response.json();
  return transformToKVFormat(data);
}

/**
 * Transform iHerb API response to KV format
 */
function transformToKVFormat(apiData: any[]): ProductUpdate[] {
  return apiData.map((item) => ({
    slug: item.slug || item.id,
    product: {
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
      slug: item.slug,
      iherb_url: item.url,
      updated_at: new Date().toISOString(),
    },
  }));
}
