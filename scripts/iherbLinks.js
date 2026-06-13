#!/usr/bin/env node
/**
 * Generate iHerb affiliate deeplinks via the official Admitad API.
 *
 * Uses the OAuth client-credentials grant (ADMITAD_CLIENT_ID / SECRET /
 * BASE64_HEADER from .env), finds the iHerb campaign connected to our website,
 * and generates a tracking deeplink for each target URL.
 *
 * Output: content/iherb-links.json
 * Usage:  node scripts/iherbLinks.js
 */
const fs = require("fs");
const path = require("path");

// ---- minimal .env loader (no dotenv dep) ----
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    // strip an inline comment (space + #...) on unquoted values
    if (!/^["']/.test(val)) val = val.replace(/\s+#.*$/, "");
    val = val.trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv(path.join(__dirname, "..", ".env"));
loadEnv(path.join(__dirname, "..", ".env.local"));

const API = process.env.ADMITAD_API_URL || "https://api.admitad.com";
const WEBSITE_ID = process.env.WEBSITE_ID || "2913701";
const CLIENT_ID = process.env.ADMITAD_CLIENT_ID;
const BASIC = process.env.ADMITAD_BASE64_HEADER; // base64(client_id:client_secret)

// iHerb targets. Search URLs always resolve (no guessing category slugs).
const TARGETS = [
  { key: "home", label: "Shop all iHerb", url: "https://www.iherb.com" },
  { key: "vitamin-c", label: "Vitamin C", url: "https://www.iherb.com/search?kw=vitamin%20c" },
  { key: "vitamin-d", label: "Vitamin D", url: "https://www.iherb.com/search?kw=vitamin%20d" },
  { key: "multivitamins", label: "Multivitamins", url: "https://www.iherb.com/search?kw=multivitamin" },
  { key: "omega-3", label: "Omega-3 Fish Oil", url: "https://www.iherb.com/search?kw=omega%203%20fish%20oil" },
  { key: "probiotics", label: "Probiotics", url: "https://www.iherb.com/search?kw=probiotics" },
  { key: "collagen", label: "Collagen", url: "https://www.iherb.com/search?kw=collagen" },
  { key: "magnesium", label: "Magnesium", url: "https://www.iherb.com/search?kw=magnesium" },
  { key: "melatonin", label: "Sleep & Melatonin", url: "https://www.iherb.com/search?kw=melatonin" },
];

async function getToken() {
  const scope = "deeplink_generator advcampaigns_for_website advcampaigns";
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    scope,
  });
  const r = await fetch(`${API}/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) throw new Error(`token failed ${r.status}: ${JSON.stringify(j)}`);
  return j.access_token;
}

async function findIherbCampaign(token) {
  // Page through campaigns connected to our website; match by name.
  let offset = 0;
  const limit = 50;
  while (true) {
    const r = await fetch(
      `${API}/advcampaigns/website/${WEBSITE_ID}/?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const j = await r.json();
    if (!r.ok) throw new Error(`advcampaigns failed ${r.status}: ${JSON.stringify(j).slice(0, 200)}`);
    const results = j.results || [];
    const hit = results.find((c) => /iherb/i.test(c.name || ""));
    if (hit) return hit;
    offset += limit;
    if (offset >= (j._meta?.count ?? 0) || results.length === 0) return null;
  }
}

async function deeplink(token, campaignId, url) {
  const r = await fetch(
    `${API}/deeplink/${WEBSITE_ID}/advcampaign/${campaignId}/?ulp=${encodeURIComponent(url)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const j = await r.json();
  if (!r.ok) throw new Error(`deeplink failed ${r.status}: ${JSON.stringify(j).slice(0, 200)}`);
  // API returns an array of generated links.
  return Array.isArray(j) ? j[0] : j.deeplink || j[0];
}

(async () => {
  if (!CLIENT_ID || !BASIC) throw new Error("Missing ADMITAD_CLIENT_ID / ADMITAD_BASE64_HEADER in .env");
  console.log("[iherb] requesting token…");
  const token = await getToken();

  console.log("[iherb] finding iHerb campaign connected to website", WEBSITE_ID, "…");
  const camp = await findIherbCampaign(token);
  if (!camp) throw new Error("iHerb campaign not found among connected campaigns (is the ad space connected?)");
  console.log(`[iherb] campaign: id=${camp.id} name="${camp.name}" status=${camp.connection_status || camp.status || "?"}`);

  const links = [];
  for (const t of TARGETS) {
    try {
      const link = await deeplink(token, camp.id, t.url);
      links.push({ ...t, gotolink: link });
      console.log(`[iherb] ✓ ${t.key} -> ${link}`);
    } catch (e) {
      console.log(`[iherb] ✗ ${t.key}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  const out = {
    campaignId: camp.id,
    campaignName: camp.name,
    websiteId: WEBSITE_ID,
    generatedAt: new Date().toISOString(),
    links,
  };
  const file = path.join(__dirname, "..", "content", "iherb-links.json");
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
  console.log(`\n[iherb] wrote ${links.length} links -> ${file}`);
})().catch((e) => {
  console.error("[iherb]", e.message || e);
  process.exit(1);
});
