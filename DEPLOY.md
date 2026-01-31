# How to Deploy SwiftHerb

## ✅ Current Working Setup

Your site works at: `https://488156f8.swiftherb.pages.dev/` and `https://swiftherb.com`

**This deployment was built by Cloudflare Pages via Git** (commit `34ef2ec` on `main` branch). This is the correct way to deploy.

## Key Insight

The **working deployment** was done via **Git**, not direct upload. Cloudflare Pages needs to **BUILD** your Next.js app on their servers to properly configure API routes.

## How to Deploy New Code (The Working Way)

### Method: Git-Based Deployment (Recommended)

Cloudflare Pages builds your Next.js app on their servers, which properly configures API routes and all features.

### Step 1: Make Sure Git is Connected

**Check in Cloudflare Dashboard**:
- Workers & Pages → swiftherb → Settings → **Builds & deployments**
- Should show: "Connected to GitHub" (or GitLab/Bitbucket)
- If not connected, click "Connect to Git" and follow the steps

### Step 2: Push Code to GitHub

```bash
# Add changes
git add .

# Commit
git commit -m "Your commit message"

# Push to GitHub (or your Git provider)
git push origin main
```

### Step 3: Cloudflare Automatically Deploys

- Cloudflare detects the push
- Builds your Next.js app on their servers
- Deploys automatically
- New deployment becomes production

**That's it!** No manual deployment needed.

## Verify Deployment

1. **Check Cloudflare Dashboard**:
   - Workers & Pages → swiftherb → Deployments
   - See new deployment appear
   - Status should be "Success"

2. **Test the Site**:
   - Visit the new deployment URL
   - Or wait for it to become production
   - Custom domain (`swiftherb.com`) will update automatically

## Environment Variables

Make sure these are set in **Cloudflare Pages** → **Settings** → **Environment Variables**:

```
DEEPSEEK_API_KEY = your_deepseek_api_key
DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL = deepseek-chat
NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref
NEXT_PUBLIC_SITE_URL = https://swiftherb.com
```

**Important**: After adding/changing variables, push a new commit to trigger redeployment.

## Build Settings (Verify These)

In Cloudflare Pages → Settings → Builds & deployments:

```
Framework preset: Next.js
Build command: pnpm build
Build output directory: .next
Root directory: /
Node.js version: 18
```

## Why This Works

**Git Deployment**:
- ✅ Cloudflare builds Next.js on their servers
- ✅ Properly configures API routes (`/api/chat`)
- ✅ Sets up Pages Functions automatically
- ✅ Handles all Next.js features correctly
- ✅ No cache file issues
- ✅ Automatic deployments

**Direct Upload** (doesn't work):
- ❌ Cloudflare doesn't rebuild
- ❌ API routes aren't configured
- ❌ Results in 404 errors

## Troubleshooting

### "Build failed"
- Check build logs in Cloudflare Dashboard
- Verify build command: `pnpm build`
- Check Node.js version: 18 or higher

### "Deployment shows 404"
- Make sure Git is connected
- Verify build completed successfully
- Check build output directory is `.next`

### "Environment variables not working"
- Variables must be set in **Production** environment
- Push a new commit after adding variables
- Check variable names are correct (case-sensitive)

## Quick Reference

```bash
# Deploy new code:
git add .
git commit -m "Update features"
git push origin main

# Cloudflare automatically:
# - Detects push
# - Builds Next.js app (.next directory)
# - Deploys to edge
# - Updates production
# - Your custom domain (swiftherb.com) updates automatically
```

## First Time Setup (If Git Not Connected)

If Cloudflare Pages isn't connected to Git yet:

1. **Create GitHub Repository** (if you don't have one):
   ```bash
   # On GitHub.com, create a new repo called "swiftherb"
   ```

2. **Connect Local Repo to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/swiftherb.git
   git push -u origin main
   ```

3. **Connect in Cloudflare**:
   - Workers & Pages → swiftherb → Settings
   - Click "Connect to Git"
   - Select your repository
   - Cloudflare will auto-detect Next.js settings
   - Click "Save and Deploy"

4. **Future deployments**: Just `git push` and Cloudflare builds automatically!

---

**That's it!** Just push to GitHub and Cloudflare handles the rest. 🚀
