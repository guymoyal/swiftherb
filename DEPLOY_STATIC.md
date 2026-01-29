# Deploy SwiftHerb as Static Site (SSG) + Cloudflare Workers

## Strategy: Static Frontend + Worker API

**Why this approach:**
- ✅ Avoids cache file size issues (no `.next/cache` in deployment)
- ✅ Faster deployments (static files only)
- ✅ Better CDN caching
- ✅ API routes moved to Cloudflare Workers (edge computing)

## Architecture

```
┌─────────────────────┐
│  Static Site (SSG)  │─── Cloudflare Pages
│  (Next.js Export)   │    - Fast CDN delivery
└──────────┬──────────┘    - No server needed
           │
           │ API calls
           ▼
┌─────────────────────┐
│  Cloudflare Worker  │─── Edge computing
│  (/api/chat)        │    - Handles AI requests
└─────────────────────┘    - Fast response times
```

## Step 1: Configure Next.js for Static Export

Already configured in `next.config.ts`:
```typescript
output: "export"  // Static site generation
```

## Step 2: Update API Endpoint

The frontend now uses:
- Production: Cloudflare Worker URL (`NEXT_PUBLIC_CHAT_API_URL`)
- Development: Local `/api/chat` route

## Step 3: Build Static Site

```bash
# Clean previous build
rm -rf .next out

# Build static site
pnpm build

# Output will be in /out directory (not .next)
```

## Step 4: Deploy Static Site to Cloudflare Pages

```bash
# Deploy the /out directory (static files only)
npx wrangler pages deploy out --project-name=swiftherb
```

**Or via Dashboard:**
1. Go to Cloudflare Dashboard → Workers & Pages
2. Create application → Pages → Upload assets
3. Upload the `out` folder contents

## Step 5: Deploy Chat API Worker

```bash
cd workers

# Update wrangler.toml to include chat worker
# Then deploy
npx wrangler deploy src/chat.ts --name swiftherb-chat-api
```

## Step 6: Configure Environment Variables

### In Cloudflare Pages (for static site):
```env
NEXT_PUBLIC_CHAT_API_URL=https://swiftherb-chat-api.YOUR_SUBDOMAIN.workers.dev
NEXT_PUBLIC_PARTNERIZE_CAMREF=your_camref
NEXT_PUBLIC_SITE_URL=https://swiftherb.com
```

### In Cloudflare Worker (for chat API):
```env
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL=deepseek-chat
```

## Step 7: Connect Custom Domain

Same as before - add `swiftherb.com` in Pages → Custom domains

## Benefits of This Approach

1. **No Cache Issues**: Static files only, no large cache files
2. **Faster Builds**: Static export is faster than full Next.js build
3. **Better Caching**: Static files cached at edge
4. **Lower Costs**: Static hosting is cheaper
5. **Edge API**: Worker runs at edge for low latency

## Quick Deploy Commands

```bash
# 1. Build static site
pnpm build

# 2. Deploy static site
npx wrangler pages deploy out --project-name=swiftherb

# 3. Deploy chat API worker (from workers directory)
cd workers
npx wrangler deploy src/chat.ts --name swiftherb-chat-api
```

---

**Ready to deploy? Let's build and deploy now!** 🚀
