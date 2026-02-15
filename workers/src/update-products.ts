/**
 * Scheduled Worker for SwiftHerb Product Updates
 * Runs every 2-4 hours to update product data from iHerb
 * 
 * Cron Schedule: Every 3 hours
 */

export interface Env {
  PRODUCTS: KVNamespace;
  ENVIRONMENT: string;
  // Impact.com API credentials (currently in use)
  IMPACT_API_KEY?: string;
  IMPACT_API_URL?: string;
  IMPACT_ACCOUNT_SID?: string; // iHerb's Advertiser Account SID (NOT your Account SID!)
  // Admitad API credentials (for future migration)
  // ADMITAD_API_KEY?: string;
  // ADMITAD_API_URL?: string;
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
 * Currently supports: Impact.com catalog API
 * Future: Will migrate to Admitad API
 * Supports multiple sources: Impact.com catalog API, iHerb API, or web scraping
 */
async function fetchProductUpdates(env: Env): Promise<ProductUpdate[]> {
  // Option 1: Impact.com Product Catalog API (currently in use)
  if (env.IMPACT_API_KEY && env.IMPACT_ACCOUNT_SID) {
    return await fetchFromImpactCom(env);
  }
  
  // Option 2: Direct iHerb API (if available)
  if (env.IHERB_API_KEY) {
    return await fetchFromIHerbAPI(env);
  }
  
  // Option 3: Web scraping (fallback - implement if needed)
  // return await fetchFromWebScraping(env);
  
  // No data source configured
  console.log("No product data source configured. Set IMPACT_API_KEY or IHERB_API_KEY.");
  return [];
}

/**
 * Fetch products from Impact.com catalog API
 * Documentation: https://integrations.impact.com/impact-publisher/reference
 * TODO: Migrate to Admitad API when ready
 */
async function fetchFromImpactCom(env: Env): Promise<ProductUpdate[]> {
  const apiUrl = env.IMPACT_API_URL || "https://api.impact.com";
  // This is YOUR Account SID (Media Partner Account SID)
  const mediaPartnerAccountSid = env.IMPACT_ACCOUNT_SID!;
  const apiKey = env.IMPACT_API_KEY!;
  
  try {
    // Step 1: Get all catalogs available to your account
    // API version 15 (matches account API version)
    // Impact.com uses Basic Auth: base64(AccountSID:APIKey)
    const basicAuth = btoa(`${mediaPartnerAccountSid}:${apiKey}`);
    
    const catalogsResponse = await fetch(
      `${apiUrl}/Mediapartners/${mediaPartnerAccountSid}/Catalogs`,
      {
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "Content-Type": "application/json",
          "Accept": "application/vnd.impact.com.v15+json", // API v15 (account version)
        },
      }
    );
    
    if (!catalogsResponse.ok) {
      const errorText = await catalogsResponse.text();
      console.error(`Impact.com API Error Details:`, {
        status: catalogsResponse.status,
        statusText: catalogsResponse.statusText,
        headers: Object.fromEntries(catalogsResponse.headers.entries()),
        body: errorText,
        url: `${apiUrl}/Mediapartners/${mediaPartnerAccountSid}/Catalogs`,
      });
      throw new Error(`Impact.com API error: ${catalogsResponse.status} - ${errorText}`);
    }
    
    const catalogsData = await catalogsResponse.json();
    
    // Log full response for debugging
    console.log("Impact.com API Response:", JSON.stringify(catalogsData, null, 2).substring(0, 1000));
    
    // Handle different response formats
    let catalogs: any[] = [];
    if (Array.isArray(catalogsData)) {
      catalogs = catalogsData;
    } else if (catalogsData.Catalogs && Array.isArray(catalogsData.Catalogs)) {
      // Impact.com API format: {"Catalogs": [...]}
      catalogs = catalogsData.Catalogs;
    } else if (catalogsData.catalogs && Array.isArray(catalogsData.catalogs)) {
      catalogs = catalogsData.catalogs;
    } else if (catalogsData.data && Array.isArray(catalogsData.data)) {
      catalogs = catalogsData.data;
    } else if (catalogsData.items && Array.isArray(catalogsData.items)) {
      catalogs = catalogsData.items;
    } else {
      console.log("Unexpected catalogs response format:", JSON.stringify(catalogsData).substring(0, 500));
      return [];
    }
    
    // Check total count from response metadata
    const totalCount = catalogsData["@total"] || catalogsData.total || catalogs.length;
    console.log(`Total catalogs available: ${totalCount}`);
    
    if (catalogs.length === 0) {
      if (totalCount === 0 || totalCount === "0") {
        console.log("⚠️ No catalogs found. Possible reasons:");
        console.log("  1. iHerb program not approved yet");
        console.log("  2. Missing 'Catalogs' API scope");
        console.log("  3. No catalogs shared with your account");
      } else {
        console.log(`⚠️ Response shows ${totalCount} catalogs but array is empty (pagination issue?)`);
      }
      return [];
    }
    
    console.log(`✓ Found ${catalogs.length} catalog(s) available`);
    console.log("Sample catalog structure:", JSON.stringify(catalogs[0], null, 2).substring(0, 500));
    
    // Step 2: Fetch items from all catalogs (or filter for iHerb)
    const allProducts: ProductUpdate[] = [];
    
    for (const catalog of catalogs) {
      try {
        // Fetch catalog items (may need pagination for large catalogs)
        // Use the catalog's advertiserAccountSid if available, otherwise use Mediapartners endpoint
        const catalogId = catalog.id || catalog.catalogId;
        const advertiserAccountSid = catalog.advertiserAccountSid || mediaPartnerAccountSid;
        
        // Use Basic Auth for items endpoint too
        const basicAuth = btoa(`${mediaPartnerAccountSid}:${apiKey}`);
        
        const itemsResponse = await fetch(
          `${apiUrl}/Mediapartners/${mediaPartnerAccountSid}/Catalogs/${catalogId}/Items`,
          {
            headers: {
              "Authorization": `Basic ${basicAuth}`,
              "Content-Type": "application/json",
              "Accept": "application/vnd.impact.com.v15+json", // API v15 (account version)
            },
          }
        );
        
        if (!itemsResponse.ok) {
          console.error(`Failed to fetch catalog ${catalog.id}: ${itemsResponse.status}`);
          continue;
        }
        
        const items = await itemsResponse.json();
        
        // Log catalog being processed
        console.log(`  Processing catalog: ${catalog.name || catalog.id} (${items.length} items)`);
        
        // Transform Impact.com items to our format
        const products = items.map((item: any) => ({
          slug: item.sku?.toLowerCase().replace(/[^a-z0-9]+/g, "_") || 
                item.id?.toLowerCase().replace(/[^a-z0-9]+/g, "_") || 
                `item_${item.id}`,
          product: {
            id: item.sku || item.id,
            title: item.name || item.title,
            price: item.price || item.salePrice || "N/A",
            image: item.imageUrl || item.image || "",
            description: item.description || "",
            category: item.category || catalog.name || "Supplements",
            slug: item.sku?.toLowerCase().replace(/[^a-z0-9]+/g, "_") || 
                  item.id?.toLowerCase().replace(/[^a-z0-9]+/g, "_") || 
                  `item_${item.id}`,
            iherb_url: item.productUrl || item.url || "",
            updated_at: new Date().toISOString(),
          },
        }));
        
        allProducts.push(...products);
        
        // Rate limiting: small delay between catalogs
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error fetching catalog ${catalog.id}:`, error);
      }
    }
    
    console.log(`✓ Successfully fetched ${allProducts.length} products from Impact.com`);
    
    // Log catalog summary
    if (allProducts.length > 0) {
      const categories = new Set(allProducts.map(p => p.product.category));
      console.log(`  Categories found: ${Array.from(categories).join(", ")}`);
      console.log(`  Products with images: ${allProducts.filter(p => p.product.image).length}`);
      console.log(`  Products with descriptions: ${allProducts.filter(p => p.product.description).length}`);
    }
    
    return allProducts;
  } catch (error) {
    console.error("Error fetching from Impact.com:", error);
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
