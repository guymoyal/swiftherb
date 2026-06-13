/**
 * Probe Impact.com catalogs for iHerb products (read-only).
 *
 * Usage:
 *   pnpm exec tsx scripts/probe-impact-catalog.ts
 *   pnpm exec tsx scripts/probe-impact-catalog.ts --query "Category ~ 'Vitamins'"
 *   pnpm catalog:probe-impact -- --limit=20 --out=data/catalog/impact-sample.json
 *
 * Env (from .env):
 *   IMPACT_ACCOUNT_SID
 *   IMPACT_AUTH_TOKEN
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

const API_BASE = "https://api.impact.com";

function loadDotenv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (process.env[key] !== undefined) continue;
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadDotenv();

function env(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing ${name} in .env`);
  return v;
}

function authHeader(sid: string, token: string): string {
  return `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`;
}

async function impactGet<T>(path: string, search?: Record<string, string>): Promise<T> {
  const sid = env("IMPACT_ACCOUNT_SID");
  const token = env("IMPACT_AUTH_TOKEN");
  const url = new URL(`${API_BASE}${path}`);
  if (search) {
    for (const [k, v] of Object.entries(search)) {
      url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      Authorization: authHeader(sid, token),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Impact ${res.status} ${path}: ${text.slice(0, 500)}`);
  }
  return JSON.parse(text) as T;
}

type CatalogRow = {
  Id: string;
  Name: string;
  CampaignId: string;
  CampaignName: string;
  AdvertiserName?: string;
  NumberOfItems?: string;
};

type CatalogItem = {
  Id: string;
  Name: string;
  Description?: string;
  ImageUrl?: string;
  Url?: string;
  CurrentPrice?: string;
  Currency?: string;
  Category?: string;
  SubCategory?: string;
  Manufacturer?: string;
  StockAvailability?: string;
  CampaignName?: string;
  CatalogId?: string;
};

function pickItemSummary(item: CatalogItem) {
  return {
    name: item.Name,
    description: (item.Description ?? "").slice(0, 160),
    imageUrl: item.ImageUrl,
    url: item.Url,
    price: item.CurrentPrice,
    currency: item.Currency,
    category: item.Category,
    subCategory: item.SubCategory,
    manufacturer: item.Manufacturer,
    stock: item.StockAvailability,
    campaign: item.CampaignName,
    catalogId: item.CatalogId,
  };
}

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit?.slice(flag.length + 1);
}

async function main() {
  const queryArg = process.argv.find((a) => a.startsWith("--query="));
  const customQuery = queryArg?.slice("--query=".length);
  const pageSize = argValue("--limit") ?? "5";
  const outPath = argValue("--out");

  console.log("Listing catalogs…\n");
  const catalogsRes = await impactGet<{ Catalogs?: CatalogRow[] }>(
    `/Mediapartners/${env("IMPACT_ACCOUNT_SID")}/Catalogs`,
    { PageSize: "50" },
  );

  const campaignsRes = await impactGet<{
    Campaigns?: { CampaignId: string; CampaignName: string; State?: string }[];
    "@total"?: string;
  }>(`/Mediapartners/${env("IMPACT_ACCOUNT_SID")}/Campaigns`, { PageSize: "20" });

  const campaigns = campaignsRes.Campaigns ?? [];
  console.log(`Joined programs (Campaigns): ${campaigns.length}`);
  for (const c of campaigns) {
    console.log(`  - [${c.CampaignId}] ${c.CampaignName}${c.State ? ` (${c.State})` : ""}`);
  }
  if (campaigns.length === 0) {
    console.log(
      "\nAPI auth works, but you have no approved brand programs yet.\n" +
        "Apply to iHerb in Impact (Marketplace → iHerb → Apply). Catalogs and ItemSearch\n" +
        "only appear after the brand accepts your partnership.\n",
    );
  }

  const catalogs = catalogsRes.Catalogs ?? [];
  if (catalogs.length === 0) {
    if (campaigns.length === 0) return;
    console.log("\nNo product catalogs yet for your joined programs.");
    return;
  }

  const iherbCatalogs = catalogs.filter(
    (c) =>
      /iherb/i.test(c.CampaignName ?? "") ||
      /iherb/i.test(c.AdvertiserName ?? "") ||
      /iherb/i.test(c.Name ?? ""),
  );

  const toShow = iherbCatalogs.length > 0 ? iherbCatalogs : catalogs;
  console.log(
    iherbCatalogs.length > 0
      ? `Found ${iherbCatalogs.length} iHerb-related catalog(s):`
      : `No name match for iHerb; showing all ${catalogs.length} catalog(s):`,
  );
  for (const c of toShow) {
    console.log(
      `  - [${c.Id}] ${c.Name} | ${c.CampaignName} | items: ${c.NumberOfItems ?? "?"}`,
    );
  }

  const catalogId = toShow[0]?.Id;
  const defaultQuery = catalogId
    ? `CatalogId = '${catalogId}' AND StockAvailability = 'InStock'`
    : `StockAvailability = 'InStock'`;

  const queries = [
    customQuery,
    defaultQuery,
    `Category ~ 'Vitamins'`,
    `Name ~ 'magnesium'`,
  ].filter(Boolean) as string[];

  const sid = env("IMPACT_ACCOUNT_SID");

  for (const Query of queries) {
    console.log(`\n--- ItemSearch Query: ${Query} ---\n`);
    try {
      const searchRes = await impactGet<{
        Items?: CatalogItem[];
        "@total"?: string;
        "@numpages"?: string;
      }>(`/Mediapartners/${sid}/Catalogs/ItemSearch`, {
        Query,
        PageSize: pageSize,
        Page: "1",
      });

      const items = searchRes.Items ?? [];
      console.log(`Returned ${items.length} item(s) (total field: ${searchRes["@total"] ?? "n/a"})`);
      if (items.length === 0) continue;

      const summaries = items.map(pickItemSummary);
      console.log(JSON.stringify(summaries, null, 2));

      if (outPath) {
        const abs = resolve(process.cwd(), outPath);
        mkdirSync(dirname(abs), { recursive: true });
        writeFileSync(
          abs,
          JSON.stringify(
            { fetchedAt: new Date().toISOString(), query: Query, items: summaries },
            null,
            2,
          ),
          "utf8",
        );
        console.log(`\nWrote ${summaries.length} item(s) to ${outPath}`);
      }
      break;
    } catch (e) {
      console.error(String(e));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
