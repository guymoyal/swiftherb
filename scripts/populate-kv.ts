/**
 * Script to populate Cloudflare KV with product data
 * Run with: pnpm tsx scripts/populate-kv.ts
 * 
 * Prerequisites:
 * 1. Set up Cloudflare KV namespace
 * 2. Configure wrangler.toml with KV namespace binding
 * 3. Authenticate with: wrangler login
 */

import { MOCK_PRODUCTS } from "../lib/products";

interface KVProduct {
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
 * Convert product name to slug
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Convert mock products to KV format
 */
function convertToKVFormat(): Record<string, KVProduct> {
  const kvProducts: Record<string, KVProduct> = {};

  Object.values(MOCK_PRODUCTS).forEach((product) => {
    const slug = toSlug(product.title);
    kvProducts[slug] = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      slug: slug,
    };
  });

  return kvProducts;
}

/**
 * Generate wrangler commands to populate KV
 */
function generateWranglerCommands() {
  const kvProducts = convertToKVFormat();
  const commands: string[] = [];

  console.log("Generating wrangler commands to populate KV...\n");

  Object.entries(kvProducts).forEach(([slug, product]) => {
    const key = `prod_${slug}`;
    const value = JSON.stringify(product);
    
    // Escape JSON for shell command
    const escapedValue = value.replace(/'/g, "'\\''");
    
    commands.push(
      `wrangler kv:key put --binding=PRODUCTS "${key}" '${escapedValue}'`
    );
  });

  console.log(`Total products: ${commands.length}\n`);
  console.log("Run these commands to populate KV:\n");
  console.log(commands.join("\n"));
  
  // Also save to file
  const fs = require("fs");
  const path = require("path");
  const outputPath = path.join(__dirname, "../scripts/kv-populate-commands.sh");
  fs.writeFileSync(outputPath, "#!/bin/bash\n\n" + commands.join("\n") + "\n");
  fs.chmodSync(outputPath, "755");
  
  console.log(`\nCommands also saved to: ${outputPath}`);
}

/**
 * Generate JSON file for bulk upload (alternative method)
 */
function generateJSONFile() {
  const kvProducts = convertToKVFormat();
  const output: Record<string, string> = {};

  Object.entries(kvProducts).forEach(([slug, product]) => {
    const key = `prod_${slug}`;
    output[key] = JSON.stringify(product);
  });

  const fs = require("fs");
  const path = require("path");
  const outputPath = path.join(__dirname, "../data/kv-products.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`\nKV data saved to: ${outputPath}`);
  console.log("You can use this file with wrangler kv:bulk put");
}

// Main execution
if (require.main === module) {
  console.log("SwiftHerb KV Population Script\n");
  console.log("=" .repeat(50));
  
  generateWranglerCommands();
  generateJSONFile();
  
  console.log("\n" + "=".repeat(50));
  console.log("\nNext steps:");
  console.log("1. Create KV namespace: wrangler kv:namespace create PRODUCTS");
  console.log("2. Add namespace ID to wrangler.toml");
  console.log("3. Run the generated commands or use bulk upload");
  console.log("4. Verify: wrangler kv:key list --binding=PRODUCTS");
}

export { convertToKVFormat, toSlug };
