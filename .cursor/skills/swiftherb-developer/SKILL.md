---
name: swiftherb-developer
description: Fullstack implementation guide for SwiftHerb—Next.js, Cloudflare Workers, KV, mocks, and product data pipelines. Use when building features, integrating APIs, or creating large mock catalogs; includes honest notes on iHerb data sources.
---

# SwiftHerb — Developer

## Repo map

| Area | Path |
|------|------|
| Frontend | `app/`, `components/` |
| Mock products | `lib/products.ts` (`MOCK_PRODUCTS`) |
| Affiliate | `lib/affiliate.ts`, `lib/admitad.ts`, `lib/partnerize.ts` |
| Workers API | `workers/src/index.ts`, `workers/src/chat.ts` |
| Product sync job | `workers/src/update-products.ts` |
| Env template | `env.example` |

## iHerb product data — facts

- **There is no official, free, public iHerb product API** documented for arbitrary catalog download like a store partner feed without an approved affiliate/API relationship.
- **Do not** implement scraping of iHerb against their terms; route product discussions toward approved feeds, merchant tools, or **synthetic / licensed** datasets.

## Large mock catalog — viable approaches

Pick one or combine:

1. **Expand `MOCK_PRODUCTS`** (or split into `data/products.json`)  
   - Generate or curate JSON matching the `Product` shape (id, title, price, image, description, category, optional `iherb_url`).  
   - Script: `tsx` script that merges CSV/JSON into one module or file.

2. **Free third-party APIs for structure only** (not iHerb inventory)  
   - Examples: **Open Food Facts** (barcode/product facts), **OpenFDA** (labels/supplements context — read their scope).  
   - Map responses into SwiftHerb’s `Product` type; **prices and iHerb URLs** may need manual mapping or search-only links (`iherb.com/search?kw=...`).

3. **Placeholder / demo APIs**  
   - e.g. JSONPlaceholder-style or static GitHub JSON for **volume testing** UI and Workers — clearly not real supplements for production claims.

4. **KV + Worker**  
   - Cron or manual `populate-kv` / deploy path: push normalized products to KV; chat and UI read from `NEXT_PUBLIC_WORKERS_API_URL`.

5. **When iHerb feed exists** (Partnerize/Admitad/other approved channel)  
   - Prefer official export or network product APIs documented for publishers; wire through `update-products.ts` patterns.

## Implementation habits

- Match existing TypeScript and component patterns; keep affiliate logic in `lib/affiliate.ts`.
- Preserve fallbacks: Worker chat already builds search URLs when `iherb_url` is missing (`workers/src/chat.ts`).
- After env changes (`NEXT_PUBLIC_*`), rebuild or restart Next.

## Quick technical checklist for “continue the project”

- [ ] `pnpm dev` runs; critical pages render.
- [ ] At least one affiliate path tested or plain search fallback acknowledged.
- [ ] Mock or KV-backed list scales without breaking `ProductCard` / chat matching.
