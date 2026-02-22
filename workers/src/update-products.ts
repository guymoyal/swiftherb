/**
 * Scheduled Worker for SwiftHerb Product Updates
 * Runs every 2-4 hours to update product data from iHerb
 * 
 * Cron Schedule: Every 3 hours
 */

export interface Env {
  PRODUCTS: KVNamespace;
  ENVIRONMENT: string;
  // Admitad API credentials
  ADMITAD_CLIENT_ID?: string;
  ADMITAD_CLIENT_SECRET?: string;
  ADMITAD_BASE64_HEADER?: string; // Base64 encoded "CLIENT_ID:CLIENT_SECRET"
  ADMITAD_API_URL?: string; // Optional, defaults to https://api.admitad.com
  ADMITAD_ADVCAMPAIGN_ID?: string; // iHerb's campaign ID for filtering products
  ADMITAD_W_ID?: string; // Your Ad Space ID for deeplinks
  ADMITAD_C_ID?: string; // iHerb's Campaign ID for deeplinks
  // Alternative: iHerb API credentials if available
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
 * Fetch product updates from source
 * Supports multiple sources: Admitad API, iHerb API, or web scraping
 * Priority: Admitad > iHerb API
 * Automatically falls back to next option if current one fails
 */
async function fetchProductUpdates(env: Env): Promise<ProductUpdate[]> {
  // Option 1: Admitad Product Feed API (preferred)
  if (env.ADMITAD_CLIENT_ID && env.ADMITAD_CLIENT_SECRET) {
    try {
      console.log("Attempting to fetch from Admitad...");
      const products = await fetchFromAdmitad(env);
      if (products.length > 0) {
        return products;
      }
      console.log("Admitad returned no products, falling back to iHerb API");
    } catch (error) {
      console.warn("Admitad API failed, falling back to iHerb API:", error instanceof Error ? error.message : String(error));
      // Continue to fallback below
    }
  }
  
  // Option 2: Direct iHerb API (if available)
  if (env.IHERB_API_KEY) {
    try {
      console.log("Attempting to fetch from iHerb API...");
      return await fetchFromIHerbAPI(env);
    } catch (error) {
      console.error("iHerb API failed:", error instanceof Error ? error.message : String(error));
    }
  }
  
  // Option 3: Web scraping (fallback - implement if needed)
  // return await fetchFromWebScraping(env);
  
  // No data source configured or all sources failed
  console.log("No product data source configured or all sources failed. Set ADMITAD_CLIENT_ID/CLIENT_SECRET or IHERB_API_KEY.");
  return [];
}

/**
 * Get OAuth2 access token from Admitad API
 * Documentation: https://www.admitad.com/en/developers/doc/api_en/
 */
async function getAdmitadAccessToken(env: Env): Promise<string> {
  const apiUrl = env.ADMITAD_API_URL || "https://api.admitad.com";
  const base64Header = env.ADMITAD_BASE64_HEADER;
  
  // Use provided base64 header or generate from client_id:client_secret
  let authHeader: string;
  let clientIdForLogging: string = "unknown";
  
  if (base64Header) {
    authHeader = `Basic ${base64Header}`;
    // Decode to get client ID for logging (without exposing secret)
    try {
      const decoded = atob(base64Header);
      clientIdForLogging = decoded.split(':')[0] || "could not decode";
    } catch (e) {
      clientIdForLogging = "invalid base64";
    }
  } else if (env.ADMITAD_CLIENT_ID && env.ADMITAD_CLIENT_SECRET) {
    authHeader = `Basic ${btoa(`${env.ADMITAD_CLIENT_ID}:${env.ADMITAD_CLIENT_SECRET}`)}`;
    clientIdForLogging = env.ADMITAD_CLIENT_ID;
  } else {
    throw new Error("Admitad credentials not configured");
  }
  
  console.log(`Attempting Admitad OAuth with Client ID: ${clientIdForLogging.substring(0, 10)}...`);
  
  const response = await fetch(`${apiUrl}/token/`, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=public",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Admitad OAuth Error:`, {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      clientIdUsed: clientIdForLogging.substring(0, 10) + "...",
    });
    throw new Error(`Admitad OAuth error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log(`✓ Successfully obtained Admitad access token`);
  return data.access_token;
}

/**
 * Fetch products from Admitad Product Feed API
 * Documentation: https://www.admitad.com/en/developers/doc/api_en/
 * Endpoint: GET https://api.admitad.com/products/
 */
async function fetchFromAdmitad(env: Env): Promise<ProductUpdate[]> {
  const apiUrl = env.ADMITAD_API_URL || "https://api.admitad.com";
  const advcampaignId = env.ADMITAD_ADVCAMPAIGN_ID; // iHerb's campaign ID for filtering (optional)
  
  try {
    // Step 1: Get OAuth2 access token
    console.log("Getting Admitad access token...");
    const accessToken = await getAdmitadAccessToken(env);
    console.log("✓ Got Admitad access token");
    
    // Step 2: Fetch product feed
    // Build query parameters
    const params = new URLSearchParams();
    params.append("format", "json"); // Use JSON format
    if (advcampaignId) {
      params.append("advcampaign_id", advcampaignId); // Filter by iHerb campaign (if provided)
      console.log(`Filtering products by campaign ID: ${advcampaignId}`);
    } else {
      console.log("⚠️ No ADVCAMPAIGN_ID set - will fetch all available products from your programs");
    }
    params.append("limit", "1000"); // Max products per page
    params.append("offset", "0"); // Start from beginning
    
    let allProducts: ProductUpdate[] = [];
    let offset = 0;
    let hasMore = true;
    const limit = 1000;
    
    // Paginate through all products
    while (hasMore) {
      params.set("offset", offset.toString());
      
      const productsResponse = await fetch(
        `${apiUrl}/products/?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!productsResponse.ok) {
        const errorText = await productsResponse.text();
        console.error(`Admitad Products API Error:`, {
          status: productsResponse.status,
          statusText: productsResponse.statusText,
          body: errorText,
          url: `${apiUrl}/products/?${params.toString()}`,
        });
        
        // If first request fails, throw error
        if (offset === 0) {
          throw new Error(`Admitad Products API error: ${productsResponse.status} - ${errorText}`);
        }
        // Otherwise, break pagination loop
        break;
      }
      
      const productsData = await productsResponse.json();
      
      // Handle different response formats
      let products: any[] = [];
      if (Array.isArray(productsData)) {
        products = productsData;
      } else if (productsData.results && Array.isArray(productsData.results)) {
        products = productsData.results;
      } else if (productsData.data && Array.isArray(productsData.data)) {
        products = productsData.data;
      } else if (productsData.items && Array.isArray(productsData.items)) {
        products = productsData.items;
      } else if (productsData.products && Array.isArray(productsData.products)) {
        products = productsData.products;
      } else {
        console.log("Unexpected Admitad response format:", JSON.stringify(productsData).substring(0, 500));
        break;
      }
      
      if (products.length === 0) {
        hasMore = false;
        break;
      }
      
      console.log(`  Fetched ${products.length} products (offset: ${offset})`);
      
      // Transform Admitad products to our format
      const transformedProducts = products.map((item: any) => {
        // Generate slug from product name or ID
        const slug = (item.name || item.title || item.product_name || String(item.id))
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "") || `product_${item.id}`;
        
        return {
          slug: slug,
          product: {
            id: item.id || item.product_id || item.sku || String(item.id),
            title: item.name || item.title || item.product_name || "Unknown Product",
            price: item.price || item.sale_price || item.regular_price || "N/A",
            image: item.image || item.image_url || item.picture || "",
            description: item.description || item.short_description || "",
            category: item.category || item.category_name || "Supplements",
            slug: slug,
            iherb_url: item.url || item.product_url || item.link || "",
            updated_at: new Date().toISOString(),
          },
        };
      });
      
      allProducts.push(...transformedProducts);
      
      // Check if there are more products
      const totalCount = productsData.count || productsData.total || productsData.results_count;
      if (totalCount && offset + products.length >= totalCount) {
        hasMore = false;
      } else if (products.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
        // Rate limiting: small delay between pages
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    
    console.log(`✓ Successfully fetched ${allProducts.length} products from Admitad`);
    
    // Log summary
    if (allProducts.length > 0) {
      const categories = new Set(allProducts.map(p => p.product.category));
      console.log(`  Categories found: ${Array.from(categories).slice(0, 10).join(", ")}${categories.size > 10 ? "..." : ""}`);
      console.log(`  Products with images: ${allProducts.filter(p => p.product.image).length}`);
      console.log(`  Products with descriptions: ${allProducts.filter(p => p.product.description).length}`);
    }
    
    return allProducts;
  } catch (error) {
    console.error("Error fetching from Admitad:", error);
    throw error;
  }
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
