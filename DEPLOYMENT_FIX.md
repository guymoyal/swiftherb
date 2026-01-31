# Fix Deployment: Cache File Size Issue

## Problem

Cloudflare Pages has a **25 MiB file size limit**, and your cache files exceed this:
- `cache/webpack/client-production/0.pack` is 25 MiB

## Solution: Use Git-Based Deployment (Recommended)

**Best Option**: Deploy via Git instead of uploading `.next` directory directly.

### Why Git Deployment is Better

1. ✅ **Cloudflare builds on their servers** - No cache files uploaded
2. ✅ **Automatic deployments** - Every push triggers a new deployment
3. ✅ **No file size issues** - Cache files aren't included
4. ✅ **Better CI/CD** - Standard workflow

### How to Set Up Git Deployment

#### Step 1: Push Your Code to GitHub

```bash
# Check git status
git status

# Add all changes
git add .

# Commit
git commit -m "Add articles, bundles, and latest features"

# Push to GitHub
git push origin main
```

#### Step 2: Connect GitHub to Cloudflare Pages

1. **Go to Cloudflare Dashboard**:
   - https://dash.cloudflare.com
   - **Workers & Pages** → **swiftherb** project

2. **Go to Settings**:
   - Click **Settings** tab
   - Scroll to **Builds & deployments**

3. **Connect Git Repository**:
   - Click **Connect to Git** (or **Edit** if already connected)
   - Select **GitHub**
   - Authorize Cloudflare (if needed)
   - Select repository: `guymoyal/swiftherb`
   - Click **Begin setup**

4. **Configure Build Settings**:
   ```
   Framework preset: Next.js
   Build command: pnpm build
   Build output directory: .next
   Root directory: /
   Node.js version: 18
   ```

5. **Add Environment Variables**:
   Go to **Settings → Environment variables** and add:
   ```
   DEEPSEEK_API_KEY = your_key
   DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
   DEEPSEEK_MODEL = deepseek-chat
   NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref
   NEXT_PUBLIC_SITE_URL = https://swiftherb.com
   ```

6. **Save and Deploy**:
   - Click **Save and Deploy**
   - Cloudflare will build on their servers (no cache files!)

## Alternative: Fix Direct Deployment

If you want to keep using `wrangler pages deploy`:

### Option A: Remove Cache Before Deploying

```bash
# Remove cache
rm -rf .next/cache

# Build (will regenerate cache, but smaller)
pnpm build

# Remove cache again before deploying
rm -rf .next/cache

# Deploy
npx wrangler pages deploy .next --project-name=swiftherb --commit-dirty=true
```

### Option B: Update .wranglerignore

Make sure `.wranglerignore` properly excludes cache:

```bash
# Check current .wranglerignore
cat .wranglerignore

# It should include:
.next/cache/**
**/*.pack
```

### Option C: Use Git Deployment Script

Create a deployment script that removes cache:

```bash
#!/bin/bash
# deploy.sh
rm -rf .next/cache
pnpm build
rm -rf .next/cache
npx wrangler pages deploy .next --project-name=swiftherb --commit-dirty=true
```

## Recommendation: Use Git Deployment ⭐

**Why Git deployment is better:**
- ✅ No cache file issues
- ✅ Automatic deployments
- ✅ Better for production
- ✅ Standard workflow
- ✅ Cloudflare builds on their servers

**Steps:**
1. Push code to GitHub
2. Connect GitHub repo in Cloudflare Pages
3. Configure build settings
4. Deploy automatically on every push

## Quick Fix Right Now

If you need to deploy immediately:

```bash
# Remove cache
rm -rf .next/cache

# Build
pnpm build

# Remove cache again (it regenerates during build)
rm -rf .next/cache

# Deploy
npx wrangler pages deploy .next --project-name=swiftherb --commit-dirty=true
```

---

**My Recommendation**: Set up Git-based deployment - it's the proper way and avoids all cache issues!
