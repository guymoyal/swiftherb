/**
 * Scheduled Worker for SwiftHerb Product Updates
 * Runs every 2-4 hours to update product data from iHerb
 * 
 * Cron Schedule: Every 3 hours (0 */3 * * *)
 */

export interface Env {
  PRODUCTS: KVNamespace;
  ENVIRONMENT: string;
  // Impact.com API credentials (if iHerb uses Impact.com)
  IMPACT_API_KEY?: string;
  IMPACT_API_URL?: string;
  IMPACT_ACCOUNT_SID?: string; // iHerb's Account SID in Impact.com
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
 * Scheduled handler - runs on cron trigger
 */
export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log(`[${new Date().toISOString()}] Starting product update job`);
    
    try {
      // Fetch updated products from source
      // For now, we'll update from mock data
      // In production, replace with iHerb API call
      const updates = await fetchProductUpdates(env);
      
      if (updates.length === 0) {
        console.log("No product updates found");
        return;
      }
      
      // Batch update KV (1000 writes/second limit)
      const batchSize = 100;
      let updated = 0;
      let failed = 0;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        
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
            
            await env.PRODUCTS.put(key, value);
            return { slug: update.slug, status: "updated" };
          })
        );
        
        // Count results
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            if (result.value.status === "updated") {
              updated++;
            }
          } else {
            failed++;
            console.error(`Failed to update product:`, result.reason);
          }
        });
        
        // Small delay between batches to avoid rate limits
        if (i + batchSize < updates.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      
      console.log(
        `[${new Date().toISOString()}] Update complete: ${updated} updated, ${failed} failed`
      );
      
      // Optional: Send notification on errors
      if (failed > 0) {
        console.error(`Warning: ${failed} products failed to update`);
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Update job failed:`, error);
      throw error; // Will trigger retry
    }
  },
};

/**
 * Fetch product updates from source
 * Supports multiple sources: Impact.com catalog API, iHerb API, or web scraping
 */
async function fetchProductUpdates(env: Env): Promise<ProductUpdate[]> {
  // Option 1: Impact.com Product Catalog API (if iHerb uses Impact.com)
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
 */
async function fetchFromImpactCom(env: Env): Promise<ProductUpdate[]> {
  const apiUrl = env.IMPACT_API_URL || "https://api.impact.com";
  const accountSid = env.IMPACT_ACCOUNT_SID!;
  const apiKey = env.IMPACT_API_KEY!;
  
  try {
    // Step 1: Get all catalogs for this advertiser (iHerb)
    const catalogsResponse = await fetch(
      `${apiUrl}/Advertisers/${accountSid}/Catalogs`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!catalogsResponse.ok) {
      throw new Error(`Impact.com API error: ${catalogsResponse.status}`);
    }
    
    const catalogs = await catalogsResponse.json();
    
    if (!catalogs || catalogs.length === 0) {
      console.log("No catalogs found in Impact.com");
      return [];
    }
    
    // Step 2: Fetch items from all catalogs
    const allProducts: ProductUpdate[] = [];
    
    for (const catalog of catalogs) {
      try {
        // Fetch catalog items (may need pagination for large catalogs)
        const itemsResponse = await fetch(
          `${apiUrl}/Advertisers/${accountSid}/Catalogs/${catalog.id}/Items`,
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!itemsResponse.ok) {
          console.error(`Failed to fetch catalog ${catalog.id}: ${itemsResponse.status}`);
          continue;
        }
        
        const items = await itemsResponse.json();
        
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
    
    console.log(`Fetched ${allProducts.length} products from Impact.com`);
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
