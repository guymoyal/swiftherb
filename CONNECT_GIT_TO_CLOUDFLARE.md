# How to Connect Git to Cloudflare Pages

## The Problem

Your Cloudflare Pages project (`swiftherb`) was created **without Git connection**. That's why you can't find Git settings.

## Solution: Connect Git to Existing Project

### Option 1: Connect Git via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**:
   - https://dash.cloudflare.com
   - **Workers & Pages** → Click on **swiftherb** project

2. **Go to Settings Tab**:
   - Click **Settings** tab (at the top)
   - Scroll down to find **"Builds & deployments"** section

3. **Look for "Source" or "Git connection"**:
   - You should see something like "Direct Upload" or "No source connected"
   - Look for a button: **"Connect to Git"** or **"Change source"**

4. **If you don't see "Connect to Git" button**:
   - The project might be set to "Direct Upload" mode
   - You may need to **create a new Pages project** connected to Git
   - OR use Option 2 below

### Option 2: Create New Pages Project Connected to Git

If you can't connect Git to the existing project:

1. **First, push your code to GitHub** (see SETUP_GIT.md)

2. **Create New Pages Project**:
   - Workers & Pages → **Create application** → **Pages** → **Connect to Git**
   - Select **GitHub**
   - Authorize Cloudflare
   - Select repository: `guymoyal/swiftherb`
   - Click **"Begin setup"**

3. **Configure Build Settings**:
   - **Project name**: `swiftherb` (or `swiftherb-new`)
   - **Framework preset**: Next.js
   - **Build command**: `pnpm build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave empty)
   - **Node.js version**: 18

4. **Add Environment Variables**:
   - Go to **Settings** → **Environment Variables**
   - Add all your variables (DEEPSEEK_API_KEY, etc.)

5. **Connect Custom Domain**:
   - Go to **Custom domains** tab
   - Add `swiftherb.com`
   - Cloudflare will configure DNS automatically

6. **Delete Old Project** (optional):
   - Once new project works, you can delete the old one

### Option 3: Use Wrangler CLI to Connect Git

Try this command:

```bash
# This might help connect Git (experimental)
npx wrangler pages project create swiftherb --git
```

But this might not work if project already exists.

## What You Should See

When Git is connected, you'll see:
- ✅ **Source**: GitHub / guymoyal/swiftherb
- ✅ **Branch**: main
- ✅ **Build command**: pnpm build
- ✅ **Deployments** tab shows Git commits

## Current Situation

Your working deployment (`488156f8`) was built from Git commit `34ef2ec`, which means:
- ✅ Git WAS connected at some point
- ❌ But now it's not showing in the dashboard
- ❌ Or the connection was lost

## Recommended Action

**Best approach**: Create a NEW Pages project connected to Git:

1. Push code to GitHub first
2. Create new Pages project from Git
3. Transfer custom domain to new project
4. Delete old project

This ensures everything is set up correctly from the start.

---

**Need help?** Tell me what you see in Cloudflare Dashboard → swiftherb → Settings tab.
