# Next Steps - SwiftHerb Project

**Last Updated:** February 15, 2026

## 🎯 Current Status

### ✅ Completed
- Admitad API integration (code ready, needs account approval)
- Cloudflare Worker deployed for product updates
- Affiliate link system (Admitad)
- SEO foundation (structured data, meta tags, sitemap)
- Documentation organized in `/docs` folder

### ⚠️ Pending
- **Admitad Account Approval**: Need to get iHerb affiliate program approved
- **Product Data**: Currently using mock data, waiting for Admitad approval
- **Affiliate Links**: Need `W_ID` and `C_ID` from Admitad dashboard

---

## 🔧 Immediate Actions Needed

### 1. Admitad Account Setup
**Status:** Waiting for approval

**Steps:**
1. Check Admitad dashboard for iHerb program approval status
2. Contact Admitad support if needed (see `docs/ADMITAD_SUPPORT_EMAILS.md`)
3. Once approved, get these IDs:
   - `ADMITAD_ADVCAMPAIGN_ID` - iHerb campaign ID
   - `NEXT_PUBLIC_ADMITAD_W_ID` - Your Ad Space ID
   - `NEXT_PUBLIC_ADMITAD_C_ID` - Campaign ID for deeplinks

4. Add to `.env`:
   ```env
   ADMITAD_ADVCAMPAIGN_ID=your_campaign_id
   NEXT_PUBLIC_ADMITAD_W_ID=your_w_id
   NEXT_PUBLIC_ADMITAD_C_ID=your_c_id
   ```

5. Restart dev server and test affiliate links

### 2. SEO Improvements (See `suggestions.md`)
**Priority:** High

**Quick fixes:**
- Add `<h1>` to homepage
- Wrap homepage sections in semantic HTML (`<section>`)
- Add Product structured data to ProductCard
- Optimize images (convert to WebP)

### 3. Product Data
**Current:** Using mock products from `lib/products.ts`

**When Admitad is approved:**
- Products will auto-update every 3 hours via Cloudflare Worker
- Check KV storage: `npx wrangler kv key list --namespace-id=cc09538377c34c08916ac38a0f5846ed`

---

## 📋 Development Commands

### Local Development
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Cloudflare Worker
```bash
cd workers
npx wrangler deploy src/update-products.ts --config wrangler-update.toml --name swiftherb-update-products
npx wrangler tail swiftherb-update-products --format pretty  # View logs
npx wrangler secret list --name swiftherb-update-products   # List secrets
```

### Testing
```bash
# Test worker manually
curl -X POST https://swiftherb-update-products.guymoy931.workers.dev

# Check KV storage
npx wrangler kv key list --namespace-id=cc09538377c34c08916ac38a0f5846ed --prefix=prod_
```

---

## 📁 Project Structure

```
swiftherb/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utilities (AI, SEO, products, etc.)
├── workers/         # Cloudflare Workers
├── docs/            # Documentation (moved from root)
├── public/          # Static assets
├── .env             # Environment variables (not in git)
├── next-steps.md    # This file
└── suggestions.md   # Improvement suggestions
```

---

## 🔗 Important Links

- **Worker URL:** https://swiftherb-update-products.guymoy931.workers.dev
- **KV Namespace:** `cc09538377c34c08916ac38a0f5846ed`
- **Admitad Dashboard:** https://www.admitad.com
- **Admitad API Docs:** https://www.admitad.com/en/developers/doc/api_en/

---

## 📚 Documentation

All documentation has been moved to `/docs` folder:
- `docs/ADMITAD_SUPPORT_EMAILS.md` - Email templates for support
- `docs/ADMITAD_IHERB_GUIDE.md` - Guide to applying for iHerb program
- `docs/AFFILIATE_LINKS_STATUS.md` - Current affiliate link status
- `docs/KV_STORAGE_EXPLANATION.md` - How KV storage works
- And more...

---

## 🐛 Troubleshooting

### Admitad Not Working
1. Check credentials: `npx wrangler secret list --name swiftherb-update-products`
2. Verify account status in Admitad dashboard
3. Check worker logs: `npx wrangler tail swiftherb-update-products`
4. Test authentication manually (see `docs/ADMITAD_IHERB_GUIDE.md`)

### Products Not Showing
- Currently using mock data until Admitad is approved
- Check `lib/products.ts` for mock products
- Once Admitad works, products will come from KV storage

### Build Errors
- Run `npm run lint` to check for issues
- Ensure all environment variables are set in `.env`
- Check TypeScript errors: `npx tsc --noEmit`

---

## 💡 Next Phase Ideas

See `suggestions.md` for:
- SEO improvements
- Feature enhancements
- Content strategy
- Growth strategies
- Technical improvements

---

**Quick Start When Returning:**
1. Check Admitad approval status
2. Review `suggestions.md` for SEO improvements
3. Run `npm run dev` to start development
4. Check `docs/` folder for detailed guides
