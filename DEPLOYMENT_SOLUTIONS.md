# Deployment Solutions for SwiftHerb

## Problem: Cache Files Too Large (25MB Limit)

Cloudflare Pages has a 25MB file size limit, and cache files exceed this.

## ✅ Solution 1: Git-Based Deployment (RECOMMENDED)

**This is the BEST solution** - Cloudflare builds on their servers, so cache files aren't uploaded.

### How It Works

1. **Push code to GitHub** → Cloudflare detects changes
2. **Cloudflare builds on their servers** → No cache files in your repo
3. **Automatic deployment** → Every push = new deployment

### Setup Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add articles, bundles, and latest features"
   git push origin main
   ```

2. **In Cloudflare Dashboard**:
   - Go to **Workers & Pages** → **swiftherb** project
   - Click **Settings** → **Builds & deployments**
   - Click **Connect to Git** (or **Edit** if already connected)
   - Select **GitHub** → **guymoyal/swiftherb**
   - Configure:
     ```
     Framework preset: Next.js
     Build command: pnpm build
     Build output directory: .next
     Root directory: /
     ```
   - Add environment variables (see below)
   - Click **Save and Deploy**

3. **Future deployments**: Just push to GitHub - automatic!

**Benefits:**
- ✅ No cache file issues
- ✅ Automatic deployments
- ✅ Standard workflow
- ✅ Cloudflare handles build

## ✅ Solution 2: Fix Direct Deployment (Quick Fix)

If you want to keep using `wrangler pages deploy`:

### Updated Deploy Script

Update `package.json`:

```json
"deploy:pages": "rm -rf .next/cache && pnpm build && rm -rf .next/cache && wrangler pages deploy .next --project-name=swiftherb --commit-dirty=true"
```

Then run:
```bash
pnpm deploy:pages
```

This:
1. Removes cache
2. Builds (cache regenerates)
3. Removes cache again
4. Deploys (no cache files!)

## ✅ Solution 3: Use Cloudflare Pages via Dashboard

Instead of CLI, use the dashboard:

1. **Push to GitHub** (if not already)
2. **In Cloudflare Dashboard**:
   - Workers & Pages → swiftherb
   - Settings → Builds & deployments
   - Connect to Git
   - Configure build settings
   - Deploy

**This avoids all cache issues** because Cloudflare builds on their servers.

## Why Git Deployment is Best

| Method | Cache Issue | Auto Deploy | Standard |
|--------|------------|-------------|----------|
| **Git Deployment** | ✅ None | ✅ Yes | ✅ Yes |
| Direct Upload | ⚠️ Need to remove cache | ❌ Manual | ⚠️ Less common |

## Environment Variables to Add

In Cloudflare Pages → Settings → Environment Variables:

```
DEEPSEEK_API_KEY = your_deepseek_api_key
DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL = deepseek-chat
NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref
NEXT_PUBLIC_SITE_URL = https://swiftherb.com
```

## Quick Action Plan

**Option A: Git Deployment (Recommended)**
1. Push code to GitHub
2. Connect GitHub in Cloudflare Pages
3. Configure build settings
4. Deploy automatically

**Option B: Fix Direct Deployment**
1. Update deploy script to remove cache
2. Run `pnpm deploy:pages`
3. Works immediately

---

**My Recommendation**: Use Git deployment - it's the proper way and you'll never have cache issues again!
