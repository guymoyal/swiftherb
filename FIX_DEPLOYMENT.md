# Fix Deployment Issue - swiftherb.pages.dev Returns 404

## Problem

You're trying to access `https://swiftherb.pages.dev/` but getting 404.

## Solution

### Your Actual Deployment URLs

Based on your Cloudflare Pages project, your site is deployed at:
- **Latest**: `https://09e8a12f.swiftherb.pages.dev`
- **Previous**: `https://488156f8.swiftherb.pages.dev`

**Try accessing**: `https://09e8a12f.swiftherb.pages.dev` (this should work!)

### Why swiftherb.pages.dev Doesn't Work

`swiftherb.pages.dev` is a **project-level domain** that needs to be configured. It's not automatically active.

## Fix Options

### Option 1: Use the Actual Deployment URL (Quick Fix)

Just use the deployment-specific URL:
- `https://09e8a12f.swiftherb.pages.dev`

This URL works and shows your latest deployment.

### Option 2: Set Up Custom Domain (Recommended)

To use `https://swiftherb.com`:

1. **In Cloudflare Pages Dashboard**:
   - Go to your `swiftherb` project
   - Click **Custom domains** tab
   - Click **Set up a custom domain**
   - Enter: `swiftherb.com`
   - Click **Continue**

2. **Cloudflare will automatically**:
   - Create DNS records
   - Provision SSL certificate
   - Route traffic to your deployment

3. **Wait 5-10 minutes** for DNS propagation

4. **Test**: Visit `https://swiftherb.com`

### Option 3: Redeploy with Latest Changes

Your current deployment is from 1 day ago. You need to deploy the new changes (articles, bundles, etc.):

```bash
# Remove cache
rm -rf .next/cache

# Build
pnpm build

# Deploy
npx wrangler pages deploy .next --project-name=swiftherb
```

This will create a new deployment with all your latest features.

## Configure Environment Variables

In Cloudflare Pages Dashboard → **Settings → Environment Variables**:

### Add These Variables:

```
DEEPSEEK_API_KEY = your_deepseek_api_key
DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL = deepseek-chat
NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref
NEXT_PUBLIC_SITE_URL = https://swiftherb.com
```

**Important**: After adding variables, you need to **redeploy** for them to take effect.

## Check Build Settings

Go to: **Settings → Builds & deployments**

Verify:
- **Framework preset**: Next.js
- **Build command**: `pnpm build`
- **Build output directory**: `.next` (NOT `out`)
- **Root directory**: `/`

## Quick Action Plan

1. **Test current deployment**: Visit `https://09e8a12f.swiftherb.pages.dev`
2. **Redeploy with new changes**: Run deployment command above
3. **Set up custom domain**: Add `swiftherb.com` in Custom domains tab
4. **Add environment variables**: Configure in Settings → Environment Variables
5. **Test**: Visit your site and verify everything works

## Why This Happened

- `swiftherb.pages.dev` is a project-level domain that needs custom domain setup
- Your actual deployments have unique URLs (`09e8a12f.swiftherb.pages.dev`)
- The latest deployment is from 1 day ago (before articles/bundles were added)
- You need to redeploy to get the new features

---

**Next Step**: Try `https://09e8a12f.swiftherb.pages.dev` first, then redeploy with your new changes!
