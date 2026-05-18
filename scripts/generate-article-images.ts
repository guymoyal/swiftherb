/**
 * Generate images for all articles.
 * Free tier: Pollinations.ai (content-relevant prompts, no API key).
 * Fallback: Picsum (deterministic placeholder if Pollinations fails).
 * Run with: npm run generate:article-images
 * Use --force to regenerate existing images.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { getPollinationsArticleImageUrl } from "../lib/pollinations";

const ARTICLES_FILE = join(process.cwd(), "data", "articles.json");
const IMAGES_DIR = join(process.cwd(), "public", "images", "articles");

/** Picsum fallback: deterministic placeholder per slug (no API key). */
function getPicsumImageUrl(slug: string): string {
  const seed = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `https://picsum.photos/seed/${seed}/800/400`;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  featuredImage: string;
  [key: string]: unknown;
}

/** Download image from URL and save to local file. Pollinations can take 10–30s. */
async function downloadImage(
  url: string,
  filePath: string,
  timeoutMs = 45000
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    writeFileSync(filePath, buffer);
    return true;
  } catch (error) {
    console.error(
      `  ❌ Download failed:`,
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

async function generateArticleImages() {
  const force = process.argv.includes("--force");
  console.log("🖼️  Article images – Pollinations.ai (free, content-relevant)\n");
  const startTime = Date.now();

  try {
    if (!existsSync(IMAGES_DIR)) {
      mkdirSync(IMAGES_DIR, { recursive: true });
      console.log(`📁 Created: ${IMAGES_DIR}\n`);
    }

    const articlesData = JSON.parse(readFileSync(ARTICLES_FILE, "utf-8"));
    const articles = articlesData as Record<string, Article>;
    const slugs = Object.keys(articles);
    console.log(`Found ${slugs.length} articles${force ? " (--force: regenerate all)" : ""}\n`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const slug of slugs) {
      const article = articles[slug];
      const localImagePath = `/images/articles/${slug}.jpg`;

      if (
        !force &&
        article.featuredImage &&
        (article.featuredImage.startsWith("/images/") ||
          article.featuredImage.includes("public"))
      ) {
        console.log(`⏭️  Skip "${article.title}" – already has local image`);
        skipped++;
        continue;
      }

      console.log(`🔍 ${article.title}...`);

      // 1. Try Pollinations (content-relevant, free)
      const pollinationsUrl = getPollinationsArticleImageUrl(
        article.title,
        article.category || ""
      );
      console.log(`  📥 Pollinations.ai (may take 15–30s)...`);
      const imageFilePath = join(IMAGES_DIR, `${slug}.jpg`);
      const ok = await downloadImage(pollinationsUrl, imageFilePath);

      if (ok) {
        article.featuredImage = localImagePath;
        console.log(`  ✅ ${localImagePath}`);
        updated++;
      } else {
        // 2. Fallback: Picsum
        console.log(`  📥 Fallback: Picsum...`);
        const picsumOk = await downloadImage(
          getPicsumImageUrl(slug),
          imageFilePath,
          15000
        );
        if (picsumOk) {
          article.featuredImage = localImagePath;
          console.log(`  ✅ ${localImagePath} (placeholder)`);
          updated++;
        } else {
          failed++;
        }
      }

      // Brief pause between requests to be nice to Pollinations
      if (slugs.indexOf(slug) < slugs.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✨ Done in ${totalTime}s`);
    console.log(`   ✅ Updated: ${updated}  ⏭️  Skipped: ${skipped}  ❌ Failed: ${failed}`);
    console.log(`\n📁 ${ARTICLES_FILE}`);
    console.log(`📁 ${IMAGES_DIR}`);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

generateArticleImages();
