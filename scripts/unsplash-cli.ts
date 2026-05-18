#!/usr/bin/env node

/**
 * Unsplash Image Generator CLI
 * 
 * Simple CLI tool for generating images using Unsplash API
 * 
 * Usage:
 *   npm run unsplash:image "query"                    - Generate single image
 *   npm run unsplash:article "title" [category]      - Generate article image
 *   npm run unsplash:batch <file.json>                - Batch generate from JSON
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  width: number;
  height: number;
  description: string | null;
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

/**
 * Search Unsplash for images
 */
async function searchUnsplash(
  query: string,
  options: {
    orientation?: "landscape" | "portrait" | "squarish";
    size?: "small" | "regular" | "full" | "raw";
    perPage?: number;
  } = {}
): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === "your_access_key_here") {
    console.error("❌ UNSPLASH_ACCESS_KEY not set!");
    console.log("\n📝 To get your free API key:");
    console.log("1. Go to: https://unsplash.com/developers");
    console.log("2. Register as developer");
    console.log("3. Create new application");
    console.log("4. Copy Access Key");
    console.log("5. Add to .env: UNSPLASH_ACCESS_KEY=your_key_here\n");
    return null;
  }

  try {
    const orientation = options.orientation || "landscape";
    const perPage = options.perPage || 1;
    
    const searchQuery = encodeURIComponent(query);
    const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=${perPage}&orientation=${orientation}&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    console.log(`🔍 Searching Unsplash for: "${query}"...`);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
    }

    const data: UnsplashSearchResponse = await response.json();
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      const size = options.size || "regular";
      const imageUrl = photo.urls[size];
      
      console.log(`✅ Found image: ${imageUrl}`);
      console.log(`   Dimensions: ${photo.width}x${photo.height}`);
      if (photo.description) {
        console.log(`   Description: ${photo.description}`);
      }
      
      return imageUrl;
    }

    console.log(`⚠️  No images found for "${query}"`);
    return null;
  } catch (error) {
    console.error(`❌ Error searching Unsplash:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

/**
 * Generate article image
 */
async function generateArticleImage(title: string, category?: string): Promise<string | null> {
  const query = `${title} ${category || ""} health wellness`.trim();
  return await searchUnsplash(query, { orientation: "landscape", size: "regular" });
}

/**
 * Generate product image
 */
async function generateProductImage(productName: string): Promise<string | null> {
  const query = `${productName} supplement product`.trim();
  return await searchUnsplash(query, { orientation: "squarish", size: "regular" });
}

/**
 * Generate custom image
 */
async function generateCustomImage(query: string, options: {
  orientation?: "landscape" | "portrait" | "squarish";
  size?: "small" | "regular" | "full" | "raw";
} = {}): Promise<string | null> {
  return await searchUnsplash(query, options);
}

/**
 * Batch generate images from JSON file
 */
async function batchGenerate(inputFile: string, options: {
  type?: "article" | "product" | "custom";
  outputFile?: string;
} = {}) {
  if (!existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    process.exit(1);
  }

  try {
    const data = JSON.parse(readFileSync(inputFile, "utf-8"));
    const items = Array.isArray(data) ? data : Object.values(data);
    
    console.log(`📦 Processing ${items.length} items...\n`);
    
    const results: Array<{ id: string; query: string; imageUrl: string | null }> = [];
    
    for (const item of items) {
      let imageUrl: string | null = null;
      let query = "";
      
      if (options.type === "article") {
        query = `${item.title || item.name} ${item.category || ""}`.trim();
        imageUrl = await generateArticleImage(item.title || item.name, item.category);
      } else {
        // Custom - use query field or title
        query = item.query || item.title || item.name || "";
        imageUrl = await generateCustomImage(query);
      }
      
      results.push({
        id: item.id || item.slug || "",
        query,
        imageUrl,
      });
      
      // Rate limiting: wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    
    // Save results
    if (options.outputFile) {
      writeFileSync(options.outputFile, JSON.stringify(results, null, 2), "utf-8");
      console.log(`\n✨ Results saved to: ${options.outputFile}`);
    } else {
      console.log("\n✨ Results:");
      console.log(JSON.stringify(results, null, 2));
    }
    
    const successCount = results.filter(r => r.imageUrl).length;
    console.log(`\n📊 Summary: ${successCount}/${results.length} images found`);
    
  } catch (error) {
    console.error("❌ Error processing batch:", error);
    process.exit(1);
  }
}

/**
 * Main CLI handler
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // Parse options
  const options: {
    orientation?: "landscape" | "portrait" | "squarish";
    size?: "small" | "regular" | "full" | "raw";
    output?: string;
    update?: string;
    type?: "article" | "product" | "custom";
  } = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--orientation" && args[i + 1]) {
      options.orientation = args[i + 1] as any;
    }
    if (args[i] === "--size" && args[i + 1]) {
      options.size = args[i + 1] as any;
    }
    if (args[i] === "--output" && args[i + 1]) {
      options.output = args[i + 1];
    }
    if (args[i] === "--update" && args[i + 1]) {
      options.update = args[i + 1];
    }
    if (args[i] === "--type" && args[i + 1]) {
      options.type = args[i + 1] as any;
    }
  }
  
  try {
    let imageUrl: string | null = null;
    
    if (command === "image" || !command) {
      // Generate custom image: unsplash:image "query"
      const query = args[1] || args[0];
      if (!query) {
        console.error("❌ Please provide a search query");
        console.log("\nUsage: npm run unsplash:image \"your query\"");
        process.exit(1);
      }
      imageUrl = await generateCustomImage(query, options);
      
    } else if (command === "article") {
      // Generate article image: unsplash:article "title" [category]
      const title = args[1];
      const category = args[2];
      if (!title) {
        console.error("❌ Please provide an article title");
        console.log("\nUsage: npm run unsplash:article \"Article Title\" [category]");
        process.exit(1);
      }
      imageUrl = await generateArticleImage(title, category);
      
    } else if (command === "batch") {
      // Batch generate: unsplash:batch <file.json>
      const inputFile = args[1];
      if (!inputFile) {
        console.error("❌ Please provide an input JSON file");
        console.log("\nUsage: npm run unsplash:batch <file.json> [--type article|product|custom] [--output <output.json>]");
        process.exit(1);
      }
      await batchGenerate(inputFile, {
        type: options.type,
        outputFile: options.output,
      });
      return; // batchGenerate handles its own output
      
    } else {
      console.error(`❌ Unknown command: ${command}`);
      console.log("\nAvailable commands:");
      console.log("  image <query>              - Generate custom image");
      console.log("  article <title> [category] - Generate article image");
      console.log("  batch <file.json>          - Batch generate from JSON");
      console.log("\nOptions:");
      console.log("  --orientation <landscape|portrait|squarish>");
      console.log("  --size <small|regular|full|raw>");
      console.log("  --output <path>            - Save URL to file");
      console.log("  --type <article|custom>   - For batch mode");
      process.exit(1);
    }
    
    // Handle output
    if (imageUrl) {
      if (options.output) {
        writeFileSync(options.output, imageUrl, "utf-8");
        console.log(`\n💾 Image URL saved to: ${options.output}`);
      } else if (options.update) {
        // Update existing file (assumes JSON with imageUrl field)
        const filePath = options.update;
        if (existsSync(filePath)) {
          const content = JSON.parse(readFileSync(filePath, "utf-8"));
          content.imageUrl = imageUrl;
          content.featuredImage = imageUrl; // Also update featuredImage if exists
          writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
          console.log(`\n💾 Updated: ${filePath}`);
        } else {
          console.error(`❌ File not found: ${filePath}`);
        }
      } else {
        console.log(`\n📋 Image URL:\n${imageUrl}`);
      }
    } else {
      process.exit(1);
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run CLI
main();
