/**
 * Sync product catalog from iHerb using an Apify Actor (third-party, paid).
 *
 * Prerequisites:
 *   - Apify account + API token: https://console.apify.com/account/integrations
 *   - Actor access (default: vaunted/iherb-scraper) — verify pricing in Apify store
 *
 * Compliance:
 *   - You are responsible for complying with iHerb Terms of Use, robots rules, and Apify terms.
 *   - This script is optional; the site works with data/catalog/products.json checked into the repo.
 *
 * Usage:
 *   APIFY_TOKEN=xxx pnpm exec tsx scripts/sync-catalog-apify.ts
 *
 * Env:
 *   APIFY_TOKEN          (required)
 *   APIFY_ACTOR_ID      (optional, default vaunted~iherb-scraper)
 *   CATALOG_MAX_PER_CATEGORY  (optional, default 30)
 *   CATALOG_TOTAL_CAP   (optional, default 300)
 *   APIFY_USE_PROXY     (optional, set to "1" to add residential proxy block from Apify docs)
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_BASE = "https://api.apify.com/v2";

type CatalogCategory = {
  slug: string;
  title: string;
  description: string;
  iherbSourceUrl: string;
};

type OutProduct = {
  slug: string;
  categorySlug: string;
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  category: string;
  iherb_url: string;
  rating?: number;
  reviewCount?: number;
};

function env(name: string, fallback?: string): string {
  const v = process.env[name];
  if (v && v.length > 0) return v;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required env: ${name}`);
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string") {
      const n = parseFloat(v);
      if (!Number.isNaN(n)) return n;
    }
  }
}

function slugifyTitle(title: string, idx: number): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "product"}_${idx}`;
}

async function apifyPost(token: string, path: string, body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify POST ${path}: ${res.status} ${text.slice(0, 500)}`);
  }
  return JSON.parse(text) as Record<string, unknown>;
}

async function apifyGet(token: string, path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify GET ${path}: ${res.status} ${text.slice(0, 500)}`);
  }
  return JSON.parse(text) as Record<string, unknown>;
}

async function waitForRun(token: string, runId: string, maxWaitS: number): Promise<Record<string, unknown>> {
  const deadline = Date.now() + maxWaitS * 1000;
  while (Date.now() < deadline) {
    const json = await apifyGet(token, `/actor-runs/${runId}`);
    const run = json.data as Record<string, unknown> | undefined;
    if (!run) throw new Error("Invalid actor-runs response");
    const status = run.status as string;
    if (status === "SUCCEEDED") return run;
    if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      throw new Error(`Apify run ${runId} ended with ${status}: ${JSON.stringify(run).slice(0, 400)}`);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error(`Timeout waiting for Apify run ${runId}`);
}

async function fetchAllDatasetItems(token: string, datasetId: string): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  let offset = 0;
  const limit = 1000;
  for (;;) {
    const path = `/datasets/${datasetId}/items?clean=true&format=json&offset=${offset}&limit=${limit}`;
    const raw = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!raw.ok) {
      const t = await raw.text();
      throw new Error(`Dataset fetch failed: ${raw.status} ${t.slice(0, 300)}`);
    }
    const batch = (await raw.json()) as Record<string, unknown>[];
    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }
  return all;
}

function mapRow(
  row: Record<string, unknown>,
  category: CatalogCategory,
  idx: number,
): OutProduct | null {
  const title =
    pickString(row, ["title", "name", "productName", "productTitle", "displayName"]) || "";
  const url =
    pickString(row, ["url", "link", "productUrl", "canonicalUrl", "href", "productLink"]) || "";

  if (!title && !url) return null;

  const description =
    pickString(row, [
      "description",
      "shortDescription",
      "overview",
      "summary",
      "productDescription",
    ]) || "";

  const image =
    pickString(row, [
      "image",
      "imageUrl",
      "imageURL",
      "thumbnail",
      "mainImage",
      "primaryImage",
      "imageLarge",
    ]) || "";

  let price =
    pickString(row, ["price", "displayPrice", "salePrice", "finalPrice", "formattedPrice"]) || "";
  if (!price) {
    const n = pickNumber(row, ["priceValue", "currentPrice"]);
    if (n !== undefined) price = `$${n.toFixed(2)}`;
  }
  if (!price) price = "See iHerb";

  const id =
    pickString(row, ["id", "productId", "sku", "pid", "itemId"]) ||
    (url.match(/\/(pr|pd)\/[^/]+\/(\d+)/)?.[2] ?? `row_${idx}`);

  const rating = pickNumber(row, ["rating", "averageRating", "stars", "starRating"]);
  const reviewCount = pickNumber(row, ["reviewCount", "reviewsCount", "ratingsCount", "reviews"]);

  const iherb_url = url.startsWith("http")
    ? url
    : title
      ? `https://www.iherb.com/search?kw=${encodeURIComponent(title)}`
      : "";

  if (!iherb_url) return null;

  return {
    slug: slugifyTitle(title || id, idx),
    categorySlug: category.slug,
    id,
    title: title || id,
    price,
    image,
    description:
      description.length > 500 ? `${description.slice(0, 497)}…` : description,
    category: category.title,
    iherb_url,
    rating,
    reviewCount,
  };
}

async function runCategory(
  token: string,
  actorId: string,
  category: CatalogCategory,
  maxItems: number,
): Promise<OutProduct[]> {
  const input: Record<string, unknown> = {
    mode: "auto",
    startUrls: [{ url: category.iherbSourceUrl }],
    countryCode: "US",
    currencyCode: "USD",
    maxItems,
    maxConcurrency: 5,
  };

  if (process.env.APIFY_USE_PROXY === "1") {
    input.proxyConfiguration = {
      useApifyProxy: true,
      apifyProxyGroups: ["RESIDENTIAL"],
    };
  }

  const started = (await apifyPost(token, `/acts/${actorId}/runs`, input)) as {
    data?: { id?: string };
  };
  const runId = started.data?.id;
  if (!runId) throw new Error(`No run id: ${JSON.stringify(started).slice(0, 400)}`);

  console.log(`  Started run ${runId} for ${category.slug}…`);
  const run = await waitForRun(token, runId, 900);
  const datasetId = run.defaultDatasetId as string | undefined;
  if (!datasetId) throw new Error("Run missing defaultDatasetId");

  const items = await fetchAllDatasetItems(token, datasetId);
  const out: OutProduct[] = [];
  items.forEach((item, i) => {
    const mapped = mapRow(item as Record<string, unknown>, category, i + out.length);
    if (mapped) out.push(mapped);
  });
  console.log(`  → ${out.length} rows mapped for ${category.slug}`);
  return out;
}

async function main() {
  const token = env("APIFY_TOKEN");
  const actorId = env("APIFY_ACTOR_ID", "vaunted~iherb-scraper");
  const perCat = parseInt(env("CATALOG_MAX_PER_CATEGORY", "30"), 10);
  const cap = parseInt(env("CATALOG_TOTAL_CAP", "300"), 10);

  const categoriesPath = join(__dirname, "../data/catalog/categories.json");
  const categories = JSON.parse(readFileSync(categoriesPath, "utf-8")) as CatalogCategory[];

  const merged: OutProduct[] = [];
  const seenUrl = new Set<string>();

  for (const cat of categories) {
    if (merged.length >= cap) break;
    const slice = Math.min(perCat, cap - merged.length);
    try {
      const rows = await runCategory(token, actorId, cat, slice);
      for (const r of rows) {
        if (seenUrl.has(r.iherb_url)) continue;
        seenUrl.add(r.iherb_url);
        merged.push(r);
        if (merged.length >= cap) break;
      }
    } catch (e) {
      console.error(`Category ${cat.slug} failed:`, e instanceof Error ? e.message : e);
    }
  }

  const outPath = join(__dirname, "../data/catalog/products.json");
  writeFileSync(outPath, JSON.stringify(merged, null, 2));
  console.log(`\nWrote ${merged.length} products to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
