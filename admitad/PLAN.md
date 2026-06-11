# Swiftherb × Admitad — Pharma/Beauty Partner Landing Pages Plan

**Date:** 2026-06-11
**Status:** PLAN ONLY — nothing harvested or built for swiftherb yet (waiting for user go).
**Reference implementation:** `/Users/guym/Projects/aibuzz` (fully working for aibuzz.world; see `docs/HARVEST.md` there).

## Goal

Add landing pages to **swiftherb.com** for every Admitad **no-approval** partner-network program
("Affiliate programs from partners" tab, Takeads/`tatrck.com` links) in pharma / beauty /
health / wellness categories. One page per program at `swiftherb.com/<program-slug>/`, with
AI-generated copy and the tracking link as CTA.

**Attribution bonus:** the Swift Herb AI ad space (id **2913701**) is ALREADY connected to the
partner catalog, and these pages live on swiftherb.com itself — so links are correctly
attributed from day one (unlike the aibuzz case, which waits on ad-space enrollment).

## Verified facts (live-tested 2026-06-11 from the aibuzz repo)

- Internal catalog API (needs the saved browser session):
  - List: `GET https://catalog.store.admitad.com/en/catalog/api/v1/website/2913701/offers/all_partners_programs/?limit=100&offset=0`
  - **Category filter works:** append `&categories=<id>` (verified: `categories=67` → 97 programs)
  - Link generation: `POST .../offers/{campaignId}/goto_link/generate_partners_programs/` → `{"goto_link": "https://tatrck.com/h/…"}` (CSRF: `X-CSRFToken` from `csrftoken` cookie; in-page fetch with `credentials: 'include'`)
- Full catalog under 2913701: 3,519 programs; harvest of all completed with 0 failures (for aibuzz).
- Login session: Playwright persistent profile (real Chrome + `--disable-blink-features=AutomationControlled`, otherwise Google SSO is blocked). Currently saved at `/Users/guym/Projects/aibuzz/.admitad-profile/`.

### Relevant category IDs (from `partners_programs_filter_data`)

| id | Category | Note |
|---|---|---|
| 67 | Online stores > Personal Care & Pharmacy | core — 97 programs (beauty brands live here too) |
| 202 | Online stores > eHealth | core |
| 120 | Online Services > Healthcare Services | core |
| 205 | Online Services > Fitness | optional, niche-adjacent |
| 85 | Online stores > Sports & Outdoor | optional, only if wanted |

(Full category tree dump available — re-fetch `partners_programs_filter_data` if needed.)

## Swiftherb repo facts (checked)

- Next.js 15 + React 19, **`output: "export"`, `trailingSlash: true`** — same static-export
  architecture as aibuzz, so the aibuzz implementation ports almost directly.
- Package manager: **pnpm** (not yarn). Deploy: `deploy:pages` / `deploy:worker` (Cloudflare).
- App Router (`app/` with about, articles, catalog, compare, …) — a root dynamic route
  `app/[slug]/page.tsx` must not collide with these static routes (`dynamicParams = false`,
  reserved-segment guard in the merge script handles this).

## Implementation tasks

1. **Port the pipeline scripts** from `/Users/guym/Projects/aibuzz/scripts/` into `swiftherb/scripts/`:
   - `lib/admitadApi.js` (only if the official-API fetch step is wanted; optional here)
   - `admitadLogin.js` — change default `WEBSITE_ID` to `2913701`; consider pointing
     `PROFILE_DIR` at the existing `/Users/guym/Projects/aibuzz/.admitad-profile/` (shared
     session, no second login) or run login once in this repo.
   - `harvestPartnerPrograms.js` — default `HARVEST_WEBSITE_ID=2913701`; **add
     `HARVEST_CATEGORIES` env** (comma-separated ids → `&categories=` repeated or
     comma-joined param — verify which form the API expects; single id verified).
   - `mergePartnerPrograms.js` — same logic; output `content/admitad-landings.json` (create
     `content/` dir; swiftherb keeps data in `data/` — decide dir, keep scripts consistent).
   - `generateLandingCopy.js` — change the prompt line "The page is on an AI/tech site
     (aibuzz.world)" to a herbal/health/wellness site (swiftherb.com); needs
     `DEEPSEEK_API_KEY` in swiftherb's `.env.local`.
2. **Port the rendering** from aibuzz:
   - `lib/partnerLandings.ts`, `components/landings/CampaignLanding.tsx`,
     `app/[slug]/page.tsx` (placeholder-slug workaround for empty state),
     `app/partners/page.tsx` index, sitemap additions.
   - Adapt styling to swiftherb's design system (check `app/globals.css` / existing components;
     aibuzz template is Tailwind — verify swiftherb uses Tailwind too before copying classes).
   - Per-page `alternates.canonical` — use swiftherb's real canonical domain.
3. **Add pnpm scripts** (mirror aibuzz's yarn ones):
   `partners:login`, `partners:harvest`, `partners:manual`, `partners:copy`, `partners:sync`.
4. **Harvest filtered**: `HARVEST_WEBSITE_ID=2913701 HARVEST_CATEGORIES=67,202,120 pnpm partners:harvest`
   (~100–300 programs expected — small, fast run).
5. **Generate copy + build**: `pnpm partners:sync && pnpm build` — review a few pages by hand
   (health/pharma copy must stay honest; the prompt already forbids invented claims — consider
   adding an explicit "no medical claims" instruction for this niche).
6. **Deploy** via the repo's existing `deploy:pages` flow — only when user approves.

## Risks / notes

- **Health/pharma copy compliance:** AI copy for supplements/pharmacy must avoid medical
  claims. Add to the DeepSeek system prompt: "Never make medical or therapeutic claims;
  never imply products treat, cure, or prevent conditions."
- **Internal API fragility:** undocumented endpoints; harvester fails loudly if Admitad
  changes them. Session expiry → re-run login.
- **Category param form for multiple ids is unverified** (single id verified). Test
  `categories=67,202` vs repeated params on a `limit=1` call before the full harvest.
- Dual-ad-space coexistence: harvests for aibuzz (all programs) and swiftherb (filtered)
  are separate runs in separate repos writing separate files — no interference.

## Current cross-project state (for context)

- aibuzz.world: 3,519 programs harvested under ad space 2913701 (temporary attribution);
  AI copy generation running; awaiting AI Buzz world ad-space catalog enrollment approval,
  then re-harvest under 2945005. Site verification meta tag deployed.
- swiftherb.com: this plan, not started.
