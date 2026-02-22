/**
 * Script to update article images using Unsplash API
 * Run with: npm run update-article-images
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { generateImageWithUnsplash } from "../lib/image-generation";

const ARTICLES_FILE = join(process.cwd(), "data", "articles.json");

interface Article {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  [key: string]: any;
}

async function updateArticleImages() {
  console.log("🖼️  Updating article images with Unsplash...\n");

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
    // Read articles file
    const articlesData = JSON.parse(readFileSync(ARTICLES_FILE, "utf-8"));
    const articles = articlesData as Record<string, Article>;

    console.log(`Found ${Object.keys(articles).length} articles\n`);

    let updated = 0;
    let skipped = 0;

    // Update each article
    for (const [slug, article] of Object.entries(articles)) {
      // Skip if already has a good image (not placeholder)
      if (
        article.featuredImage &&
        !article.featuredImage.includes("placeholder") &&
        !article.featuredImage.includes("iherb.com/m/")
      ) {
        console.log(`⏭️  Skipping "${article.title}" - already has image`);
        skipped++;
        continue;
      }

      console.log(`🔍 Fetching image for: "${article.title}"...`);

      // Generate search query from article title and category
      const searchQuery = `${article.title} ${article.category || ""} health supplement`;
      const imageUrl = await generateImageWithUnsplash(searchQuery);

      if (imageUrl) {
        articles[slug].featuredImage = imageUrl;
        console.log(`✅ Updated: ${imageUrl.substring(0, 60)}...`);
        updated++;
      } else {
        console.log(`⚠️  No image found for "${article.title}"`);
      }

      // Rate limiting: wait 1 second between requests (Unsplash allows 50/hour)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Save updated articles
    writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");

    console.log(`\n✨ Done! Updated ${updated} articles, skipped ${skipped}`);
    console.log(`📁 Updated file: ${ARTICLES_FILE}`);
  } catch (error) {
    console.error("❌ Error updating article images:", error);
    process.exit(1);
  }
}

// Run the script
updateArticleImages();
