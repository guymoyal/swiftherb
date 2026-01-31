# How to Deploy SwiftHerb - Complete Guide

## ✅ Your Site is Deployed!

**Latest deployment**: `https://9ffa2373.swiftherb.pages.dev`

## Two Ways to Deploy

### Method 1: Direct Deployment (Current Method)

**Use this when**: You want to deploy immediately without pushing to Git.

```bash
# This command now automatically removes cache
pnpm deploy:pages
```

**What it does**:
1. Removes cache files
2. Builds your site
3. Removes cache again (regenerated during build)
4. Deploys to Cloudflare Pages

**Pros**: Quick, immediate deployment
**Cons**: Manual, need to run command each time

### Method 2: Git-Based Deployment (Recommended for Production)

**Use this when**: You want automatic deployments on every push.

**Setup** (one-time):
1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **In Cloudflare Dashboard**:
   - Go to **Workers & Pages** → **swiftherb**
   - Click **Settings** → **Builds & deployments**
   - Click **Connect to Git**
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

**After setup**: Every `git push` = automatic deployment!

**Pros**: 
- ✅ Automatic deployments
- ✅ No cache issues (Cloudflare builds on their servers)
- ✅ Standard workflow
- ✅ Better for production

**Cons**: Requires GitHub setup

## Environment Variables

**In Cloudflare Pages Dashboard** → **Settings** → **Environment Variables**:

Add these for **Production** environment:

```
DEEPSEEK_API_KEY = your_deepseek_api_key
DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL = deepseek-chat
NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref
NEXT_PUBLIC_SITE_URL = https://swiftherb.com
```

**Important**: After adding variables, redeploy for them to take effect.

## Connect Custom Domain (swiftherb.com)

1. **In Cloudflare Pages Dashboard**:
   - Go to **swiftherb** project
   - Click **Custom domains** tab
   - Click **Set up a custom domain**
   - Enter: `swiftherb.com`
   - Click **Continue**

2. **Cloudflare automatically**:
   - Creates DNS records
   - Provisions SSL certificate
   - Configures routing

3. **Wait 5-10 minutes**, then visit `https://swiftherb.com`

## Why Cloudflare Pages is Perfect ✅

**Cloudflare Pages is the RIGHT choice** because:
- ✅ Free hosting
- ✅ Fast CDN
- ✅ Automatic SSL
- ✅ Edge Functions (for API routes)
- ✅ Easy custom domain setup
- ✅ Git integration
- ✅ Great performance

**The cache issue is solved** - just remove cache before deploying, or use Git deployment.

## Quick Commands

```bash
# Deploy directly (removes cache automatically)
pnpm deploy:pages

# Or manually:
rm -rf .next/cache
pnpm build
rm -rf .next/cache
npx wrangler pages deploy .next --project-name=swiftherb --commit-dirty=true
```

## Next Steps

1. ✅ **Site deployed** at `https://9ffa2373.swiftherb.pages.dev`
2. ⏳ **Connect custom domain** (`swiftherb.com`) in Cloudflare Pages
3. ⏳ **Add environment variables** (DeepSeek API key, etc.)
4. ⏳ **Set up Git deployment** (optional, but recommended)

---

**Your site is working!** Just need to connect the custom domain and add environment variables. 🚀
