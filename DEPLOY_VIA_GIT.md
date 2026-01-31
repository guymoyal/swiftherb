# Deploy SwiftHerb via Git (Recommended Solution)

## Why Git Deployment?

**Problem**: Direct `wrangler pages deploy` doesn't properly handle Next.js API routes on Cloudflare Pages.

**Solution**: Use Git-based deployment - Cloudflare builds on their servers and handles Next.js correctly.

## Step-by-Step Setup

### Step 1: Push Code to GitHub

```bash
# Check what needs to be committed
git status

# Add all changes
git add .

# Commit
git commit -m "Add articles, bundles, scheduled worker, and latest features"

# Push to GitHub
git push origin main
```

**If you don't have a GitHub repo yet:**
1. Go to https://github.com/new
2. Create repository: `swiftherb`
3. Don't initialize with README (we already have files)
4. Then run:
   ```bash
   git remote add origin https://github.com/guymoyal/swiftherb.git
   git push -u origin main
   ```

### Step 2: Connect GitHub in Cloudflare Pages

1. **Go to Cloudflare Dashboard**:
   - https://dash.cloudflare.com
   - **Workers & Pages** → **swiftherb** project

2. **Go to Settings**:
   - Click **Settings** tab
   - Scroll to **Builds & deployments** section

3. **Connect Git Repository**:
   - Click **Connect to Git** button (or **Edit** if already connected)
   - Select **GitHub**
   - Authorize Cloudflare (if needed)
   - Select repository: **guymoyal/swiftherb**
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
   Go to **Environment variables** section and add:
   ```
   DEEPSEEK_API_KEY = your_deepseek_api_key
   DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
   DEEPSEEK_MODEL = deepseek-chat
   NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref
   NEXT_PUBLIC_SITE_URL = https://swiftherb.com
   ```

6. **Save and Deploy**:
   - Click **Save and Deploy**
   - Cloudflare will build on their servers
   - Wait 2-5 minutes for build to complete

### Step 3: Verify Deployment

After build completes:
- Check **Deployments** tab for status
- Visit the deployment URL
- Should work correctly with API routes!

## Why This Works Better

**Git Deployment**:
- ✅ Cloudflare builds on their servers (no cache files uploaded)
- ✅ Properly handles Next.js API routes
- ✅ Automatic deployments on every push
- ✅ Standard workflow
- ✅ No file size issues

**Direct Upload** (`wrangler pages deploy`):
- ⚠️ Cache file size issues
- ⚠️ May not handle API routes correctly
- ⚠️ Manual process each time

## Future Deployments

After setup, deploying is simple:

```bash
# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Update features"
git push origin main

# Cloudflare automatically deploys! 🚀
```

## Troubleshooting

### "Repository not found"
- Make sure repository exists on GitHub
- Check repository name matches: `swiftherb`
- Verify GitHub username: `guymoyal`

### "Build failed"
- Check build logs in Cloudflare Dashboard
- Verify build command: `pnpm build`
- Check Node.js version: 18 or higher
- Make sure all dependencies are in `package.json`

### "Environment variables not working"
- Variables must be set in **Production** environment
- Variable names are case-sensitive
- Redeploy after adding variables

---

**This is the proper way to deploy Next.js to Cloudflare Pages!** 🎯
