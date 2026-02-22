/**
 * Script to update product images using Unsplash API
 * Run with: npm run update-product-images
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { generateImageWithUnsplash } from "../lib/image-generation";
import { MOCK_PRODUCTS } from "../lib/products";

const PRODUCTS_FILE = join(process.cwd(), "lib", "products.ts");

async function updateProductImages() {
  console.log("🖼️  Updating product images with Unsplash...\n");

  // Check if API key is set
  if (!process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY === "your_access_key_here") {
    console.error("❌ UNSPLASH_ACCESS_KEY not set!");
    console.log("\n📝 To get your free API key:");
    console.log("1. Go to: https://unsplash.com/developers");
    console.log("2. Register as developer");
    console.log("3. Create new application");
    console.log("4. Copy Access Key");
    console.log("5. Add to .env: UNSPLASH_ACCESS_KEY=your_key_here\n");
    process.exit(1);
  }

  try {
    console.log(`Found ${Object.keys(MOCK_PRODUCTS).length} products\n`);

    const updates: Array<{ slug: string; oldImage: string; newImage: string }> = [];
    let updated = 0;
    let skipped = 0;

    // Update each product
    for (const [slug, product] of Object.entries(MOCK_PRODUCTS)) {
      // Skip if already has a good image (not placeholder)
      if (
        product.image &&
        !product.image.includes("placeholder") &&
        !product.image.includes("via.placeholder")
      ) {
        console.log(`⏭️  Skipping "${product.title}" - already has image`);
        skipped++;
        continue;
      }

      console.log(`🔍 Fetching image for: "${product.title}"...`);

      // Generate search query from product title
      const searchQuery = `${product.title} supplement product`;
      const imageUrl = await generateImageWithUnsplash(searchQuery);

      if (imageUrl) {
        updates.push({
          slug,
          oldImage: product.image,
          newImage: imageUrl,
        });
        console.log(`✅ Found: ${imageUrl.substring(0, 60)}...`);
        updated++;
      } else {
        console.log(`⚠️  No image found for "${product.title}"`);
      }

      // Rate limiting: wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (updates.length > 0) {
      // Read the products file
      let productsCode = readFileSync(PRODUCTS_FILE, "utf-8");

      // Update each product image
      for (const update of updates) {
        // Find and replace the image URL
        const oldImagePattern = new RegExp(
          `(image:\\s*")([^"]*${update.oldImage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"]*)(")`,
          "g"
        );
        productsCode = productsCode.replace(
          oldImagePattern,
          `$1${update.newImage}$3`
        );
      }

      // Write updated file
      writeFileSync(PRODUCTS_FILE, productsCode, "utf-8");

      console.log(`\n✨ Done! Updated ${updated} products, skipped ${skipped}`);
      console.log(`📁 Updated file: ${PRODUCTS_FILE}`);
    } else {
      console.log(`\n✨ No updates needed. All products already have images.`);
    }
  } catch (error) {
    console.error("❌ Error updating product images:", error);
    process.exit(1);
  }
}

// Run the script
updateProductImages();
