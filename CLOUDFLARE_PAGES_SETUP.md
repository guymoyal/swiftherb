# Cloudflare Pages Configuration Guide

## Current Issue: Can't Access Site

If you can't see your page at `https://swiftherb.pages.dev/`, here's how to fix it:

## Step 1: Check Your Actual Deployment URL

Cloudflare Pages creates a unique URL for each deployment. Your site might be at:
- `https://swiftherb-XXXXX.pages.dev` (where XXXXX is a deployment ID)
- Or `https://swiftherb.pages.dev` (if custom domain is configured)

**To find your actual URL:**
1. Go to Cloudflare Dashboard → Workers & Pages → swiftherb
2. Look at the "Deployments" tab
3. Find the latest deployment and click on it
4. You'll see the preview URL there

## Step 2: Configure Environment Variables

In Cloudflare Pages dashboard, go to:
**Settings → Environment Variables**

### Production Environment Variables

Add these variables:

```
DEEPSEEK_API_KEY = your_deepseek_api_key_here
DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL = deepseek-chat
NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref_here
NEXT_PUBLIC_SITE_URL = https://swiftherb.com
```

**Important Notes:**
- Variables starting with `NEXT_PUBLIC_` are available in the browser
- Variables without `NEXT_PUBLIC_` are server-side only
- After adding variables, you need to **redeploy** for them to take effect

## Step 3: Configure Build Settings

Go to: **Settings → Builds & deployments**

### Build Configuration

```
Framework preset: Next.js
Build command: pnpm build
Build output directory: .next
Root directory: /
Node.js version: 18 or higher
```

**Important:** 
- Build output directory should be `.next` (not `out`)
- We're using Full-Stack Next.js, not static export

## Step 4: Check Deployment Status

1. Go to **Deployments** tab
2. Check the latest deployment:
   - ✅ **Success** = Green checkmark
   - ❌ **Failed** = Red X (check logs)
   - ⏳ **Building** = Still in progress

3. If deployment failed:
   - Click on the failed deployment
   - Check **Build logs** for errors
   - Common issues:
     - Missing environment variables
     - Build command errors
     - File size limits

## Step 5: Set Up Custom Domain (Optional)

To use `https://swiftherb.com`:

1. Go to **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `swiftherb.com`
4. Cloudflare will automatically:
   - Create DNS records
   - Provision SSL certificate
   - Configure routing

**Wait 5-10 minutes** for DNS propagation.

## Step 6: Redeploy After Configuration Changes

After adding environment variables or changing settings:

**Option A: Via Dashboard**
- Go to **Deployments** tab
- Click **Retry deployment** on latest deployment
- Or trigger a new deployment by pushing to Git

**Option B: Via CLI**
```bash
# Remove cache
rm -rf .next/cache

# Build
pnpm build

# Deploy
npx wrangler pages deploy .next --project-name=swiftherb
```

## Troubleshooting

### "404 Not Found" Error

**Possible Causes:**
1. **Wrong URL** - Check actual deployment URL in dashboard
2. **Build failed** - Check build logs
3. **Custom domain not connected** - Set up custom domain
4. **Cache issue** - Clear browser cache or try incognito

**Solutions:**
1. Find your actual deployment URL in Cloudflare Dashboard
2. Check deployment status (should be "Success")
3. Verify build completed without errors
4. Try accessing the preview URL directly

### "Build Failed" Error

**Check Build Logs:**
- Go to Deployments → Failed deployment → Build logs
- Look for error messages
- Common issues:
  - Missing dependencies
  - TypeScript errors
  - Environment variable issues
  - File size limits

**Fix:**
- Fix errors shown in logs
- Redeploy

### Environment Variables Not Working

**Check:**
- Variables are set in correct environment (Production)
- Variable names match exactly (case-sensitive)
- Variables starting with `NEXT_PUBLIC_` are for browser
- Redeployed after adding variables

### Site Shows Old Version

**Solution:**
- Clear browser cache
- Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check latest deployment is active

## Quick Checklist

- [ ] Found actual deployment URL in Cloudflare Dashboard
- [ ] Latest deployment shows "Success" status
- [ ] Environment variables are configured
- [ ] Build settings are correct (output: `.next`)
- [ ] Custom domain is set up (if using swiftherb.com)
- [ ] Redeployed after configuration changes
- [ ] Tested the actual deployment URL

## Next Steps After Site Works

1. **Set up Workers & KV** (for product data)
2. **Connect custom domain** (if not done)
3. **Test all features** (articles, chat, bundles)
4. **Monitor performance** (Cloudflare Analytics)

---

**Need Help?** Check the deployment logs in Cloudflare Dashboard for specific error messages.
