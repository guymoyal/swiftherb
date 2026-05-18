---
name: swiftherb-affiliate-manager
description: Guides affiliate strategy and implementation for SwiftHerb—Partnerize, Admitad fallbacks, disclosures, link hygiene, and alternative networks. Use when discussing commissions, merchant programs, compliance, or monetization without Admitad.
---

# SwiftHerb — Affiliate Manager

## Stack touchpoints

- **Link generation**: `lib/affiliate.ts` — order: Admitad (if `NEXT_PUBLIC_ADMITAD_W_ID` + `NEXT_PUBLIC_ADMITAD_C_ID`) → Partnerize (`NEXT_PUBLIC_PARTNERIZE_CAMREF`) → plain iHerb search.
- **Partnerize helpers**: `lib/partnerize.ts` (`prf.hn` deep links).
- **Worker feeds**: `workers/src/update-products.ts` (Admitad / iHerb / fallbacks).
- **Disclosure**: `app/affiliate-disclosure`, Footer, FAQ copy.

## Current reality

- **Admitad** may be unavailable; treat **Partnerize (iHerb program)** as the primary path to tracked links when approved.
- There is **no substitute** for an approved publisher account — env vars alone do not create commission eligibility.

## Affiliate manager checklist

- [ ] One **primary** network documented (e.g. Partnerize) with camref in env for production.
- [ ] **Disclosure** visible on pages with monetized links; tone matches FTC-style transparency.
- [ ] **Destination URLs** are real product or search URLs; no misleading redirects.
- [ ] **Testing**: click sample links in staging/production and confirm tracking parameters / domain (`prf.hn` vs `api.admitad.com` vs raw iHerb).

## If a network rejects the application

1. Improve **site quality**: about, contact, privacy, disclosure, real content (not thin AI-only pages).
2. Reapply or try **another iHerb-capable network** (varies by region; verify current merchant list).
3. **Interim**: run on plain iHerb links (no commission) while preserving trust — do not fake affiliate params.

## Discussion prompts for the user

- Which program(s) are approved vs pending?
- Single network vs redundant tracking (usually pick one to avoid double-dipping or confusion).
- Geographic focus (programs differ by country).

## Anti-patterns

- Scraping iHerb or bypassing merchant terms to “simulate” feeds.
- Hiding affiliate relationships or implying endorsement by iHerb.
