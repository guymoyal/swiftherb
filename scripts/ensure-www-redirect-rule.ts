/**
 * Ensures a zone-level Dynamic Redirect: www → apex (canonical host).
 *
 * `wrangler pages deploy` cannot fix www vs apex; Cloudflare Pages `_redirects`
 * also does not support domain-level redirects. This uses the Rulesets API.
 *
 * Prerequisites:
 * - API token with Zone > Single Redirect > Edit (or Dynamic URL Redirects Write)
 * - Zone on Cloudflare with orange-cloud (proxied) DNS for www and apex
 *
 * Usage:
 *   export CLOUDFLARE_API_TOKEN=...
 *   export CLOUDFLARE_ZONE_NAME=swiftherb.com   # or CLOUDFLARE_ZONE_ID
 *   pnpm cf:www-redirect
 *
 * Env:
 *   CLOUDFLARE_API_TOKEN  (required)
 *   CLOUDFLARE_ZONE_ID    (required unless CLOUDFLARE_ZONE_NAME is set)
 *   CLOUDFLARE_ZONE_NAME  (optional, e.g. swiftherb.com — resolves zone ID)
 *   NEXT_PUBLIC_SITE_URL  (optional, default https://swiftherb.com) — sets apex + www host
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const RULE_REF = "swiftherb_www_to_apex";
const PHASE = "http_request_dynamic_redirect";

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

async function cfApi<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<{ result: T | null; errors: { message: string }[]; success: boolean }> {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const body = (await res.json()) as {
    result: T | null;
    errors: { message: string }[];
    success: boolean;
  };
  return body;
}

function stripRuleForUpdate(rule: Record<string, unknown>) {
  const { last_updated: _lu, version: _v, ...rest } = rule;
  return rest as Record<string, unknown>;
}

function buildWwwRule(wwwHost: string, apexOrigin: string) {
  return {
    ref: RULE_REF,
    expression: `http.host eq "${wwwHost}"`,
    description: "SwiftHerb: redirect www to apex (canonical host)",
    action: "redirect",
    action_parameters: {
      from_value: {
        target_url: {
          expression: `concat("${apexOrigin}", http.request.uri.path)`,
        },
        status_code: 301,
        preserve_query_string: true,
      },
    },
    enabled: true,
  };
}

async function resolveZoneId(token: string, name: string): Promise<string> {
  const data = await cfApi<
    { id: string; name: string }[]
  >(token, `/zones?name=${encodeURIComponent(name)}`);
  if (!data.success || !data.result?.length) {
    throw new Error(
      data.errors?.map((e) => e.message).join("; ") ||
        `Could not resolve zone "${name}"`,
    );
  }
  return data.result[0].id;
}

async function main() {
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!token) {
    console.error(
      "Missing CLOUDFLARE_API_TOKEN. Create a token with Zone > Single Redirect > Edit.",
    );
    process.exit(1);
  }

  let zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim();
  const zoneName = process.env.CLOUDFLARE_ZONE_NAME?.trim();
  if (!zoneId) {
    if (!zoneName) {
      console.error(
        "Set CLOUDFLARE_ZONE_ID or CLOUDFLARE_ZONE_NAME (e.g. swiftherb.com).",
      );
      process.exit(1);
    }
    zoneId = await resolveZoneId(token, zoneName);
    console.log(`Resolved zone ID for ${zoneName}: ${zoneId}`);
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://swiftherb.com"
  ).trim();
  let apexUrl: URL;
  try {
    apexUrl = new URL(siteUrl);
  } catch {
    console.error(`Invalid NEXT_PUBLIC_SITE_URL: ${siteUrl}`);
    process.exit(1);
  }
  const apexHost = apexUrl.hostname;
  const apexOrigin = `${apexUrl.protocol}//${apexHost}`;
  const wwwHost = `www.${apexHost}`;

  const wwwRule = buildWwwRule(wwwHost, apexOrigin);

  const entry = await cfApi<{
    id: string;
    name: string;
    kind: string;
    rules: Record<string, unknown>[];
  }>(token, `/zones/${zoneId}/rulesets/phases/${PHASE}/entrypoint`);

  if (!entry.success && entry.errors?.length) {
    const msg = entry.errors.map((e) => e.message).join("; ");
    if (!/not found|does not exist|no.*ruleset/i.test(msg)) {
      console.error("Could not load Dynamic Redirect ruleset:", msg);
      process.exit(1);
    }
  }

  if (entry.success && entry.result?.id) {
    const rulesetId = entry.result.id;
    const existing = entry.result.rules || [];
    const withoutOld = existing.filter(
      (r) => (r as { ref?: string }).ref !== RULE_REF,
    );
    const cleaned = withoutOld.map((r) => stripRuleForUpdate(r));
    const newRules = [...cleaned, wwwRule];

    const updated = await cfApi<{ id: string }>(
      token,
      `/zones/${zoneId}/rulesets/${rulesetId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: entry.result.name || "Redirect rules ruleset",
          kind: entry.result.kind || "zone",
          phase: PHASE,
          rules: newRules,
        }),
      },
    );

    if (!updated.success) {
      console.error(
        "Update failed:",
        updated.errors?.map((e) => e.message).join("; "),
      );
      process.exit(1);
    }
    console.log(
      `OK — updated Dynamic Redirect ruleset (${rulesetId}). www → ${apexOrigin}`,
    );
    return;
  }

  // No entrypoint ruleset yet — create phase ruleset
  const created = await cfApi<{ id: string }>(token, `/zones/${zoneId}/rulesets`, {
    method: "POST",
    body: JSON.stringify({
      name: "Redirect rules (SwiftHerb www→apex)",
      kind: "zone",
      phase: PHASE,
      rules: [wwwRule],
    }),
  });

  if (!created.success) {
    console.error(
      "Create failed:",
      created.errors?.map((e) => e.message).join("; "),
    );
    process.exit(1);
  }

  console.log(
    `OK — created Dynamic Redirect ruleset. www (${wwwHost}) → ${apexOrigin}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
