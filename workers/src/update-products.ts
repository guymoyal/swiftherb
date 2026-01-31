/**
 * Scheduled Worker for SwiftHerb Product Updates
 * Runs every 2-4 hours to update product data from iHerb
 * 
 * Cron Schedule: Every 3 hours (0 */3 * * *)
 */

export interface Env {
  PRODUCTS: KVNamespace;
  ENVIRONMENT: string;
  // Optional: iHerb API credentials if available
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
 * TODO: Replace with actual iHerb API integration
 */
async function fetchProductUpdates(env: Env): Promise<ProductUpdate[]> {
  // For now, return empty array (no updates)
  // In production, this would:
  // 1. Call iHerb API to get updated products
  // 2. Parse and transform data
  // 3. Return array of updates
  
  // Example structure:
  // const response = await fetch('https://api.iherb.com/products', {
  //   headers: { 'Authorization': `Bearer ${env.IHERB_API_KEY}` }
  // });
  // const data = await response.json();
  // return transformToKVFormat(data);
  
  return [];
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
