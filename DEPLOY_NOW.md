# Deploy SwiftHerb to Cloudflare Pages - Step by Step

## Current Status ✅
- ✅ Domain `swiftherb.com` added to Cloudflare
- ✅ Nameservers configured (this is correct!)
- ⏳ No DNS records yet (will be created automatically)

## Step-by-Step Deployment Process

### Step 1: Push Code to Git (if not already done)

```bash
# Check if you have a remote repository
git remote -v

# If no remote, create one on GitHub first:
# 1. Go to https://github.com/new
# 2. Create repository named "swiftherb"
# 3. Then run:
git remote add origin https://github.com/YOUR_USERNAME/swiftherb.git
git push -u origin main
```

### Step 2: Deploy to Cloudflare Pages

1. **Go to Cloudflare Dashboard**:
   - Visit https://dash.cloudflare.com
   - Click **Workers & Pages** in the left sidebar
   - Click **Create application**
   - Click **Pages** tab
   - Click **Connect to Git**

2. **Connect Your Repository**:
   - Select your Git provider (GitHub/GitLab)
   - Authorize Cloudflare if needed
   - Select your `swiftherb` repository
   - Click **Begin setup**

3. **Configure Build Settings**:
   ```
   Project name: swiftherb
   
   Framework preset: Next.js (or Auto-detect)
   Build command: pnpm build
   Build output directory: .next
   Root directory: /
   Node.js version: 18 or higher
   ```
   
   **Important:** Cloudflare Pages automatically detects Next.js and handles API routes correctly!

4. **Add Environment Variables** (IMPORTANT):
   - Click **Environment variables** button
   - Add these variables one by one:
   
   ```
   DEEPSEEK_API_KEY = your_actual_deepseek_api_key
   DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
   DEEPSEEK_MODEL = deepseek-chat
   NEXT_PUBLIC_PARTNERIZE_CAMREF = your_actual_camref
   NEXT_PUBLIC_SITE_URL = https://swiftherb.com
   ```
   
   **Note:** Replace `your_actual_deepseek_api_key` and `your_actual_camref` with your real values!

5. **Deploy**:
   - Click **Save and Deploy**
   - Wait 2-5 minutes for the build to complete
   - Your site will be live at: `https://swiftherb-xxxxx.pages.dev`

### Step 3: Connect Custom Domain (This Creates DNS Records!)

1. **In Cloudflare Pages Dashboard**:
   - After deployment completes, click on your `swiftherb` project
   - Go to **Custom domains** tab
   - Click **Set up a custom domain**

2. **Add Your Domain**:
   - Enter: `swiftherb.com`
   - Click **Continue**
   - Cloudflare will automatically create DNS records for you!

3. **Add www Subdomain** (Optional but recommended):
   - Click **Set up a custom domain** again
   - Enter: `www.swiftherb.com`
   - Click **Continue**

4. **Wait for DNS & SSL**:
   - DNS records will be created automatically (CNAME records)
   - SSL certificate will be provisioned automatically
   - This usually takes 2-5 minutes
   - Status will show "Active" when ready

### Step 4: Verify DNS Records Were Created

Go to Cloudflare Dashboard → **DNS** → **Records**

You should now see:
```
Type    Name              Content                          Proxy
CNAME   swiftherb.com     swiftherb-xxxxx.pages.dev        Proxied (orange cloud)
CNAME   www               swiftherb-xxxxx.pages.dev        Proxied (orange cloud)
```

**Note:** The `xxxxx` will be your actual Pages deployment ID.

### Step 5: Test Your Site

1. **Wait 5-10 minutes** for DNS propagation
2. Visit: `https://swiftherb.com`
3. Check SSL: Should show green lock icon
4. Test pages:
   - `https://swiftherb.com/robots.txt` (should show `Disallow: /`)
   - `https://swiftherb.com/about`
   - `https://swiftherb.com/privacy`
   - `https://swiftherb.com/terms`

## Quick Command Reference

```bash
# Check git status
git status

# Push to GitHub (if needed)
git add .
git commit -m "Ready for deployment"
git push origin main

# Test build locally first (recommended)
pnpm build
pnpm start
# Visit http://localhost:3000 to verify
```

## Troubleshooting

### "Build Failed"
- Check build logs in Cloudflare Pages dashboard
- Make sure all environment variables are set
- Verify `pnpm build` works locally first

### "Domain Not Resolving"
- Wait 5-10 minutes for DNS propagation
- Check DNS records exist in Cloudflare Dashboard
- Ensure records are "Proxied" (orange cloud icon)

### "SSL Not Working"
- Wait a few minutes for certificate provisioning
- Check SSL/TLS settings: Should be "Full" or "Full (strict)"
- SSL is automatic with Cloudflare

### "Environment Variables Not Working"
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Variables starting with `NEXT_PUBLIC_` are available in browser

## What Happens Automatically

✅ DNS records created when you add custom domain  
✅ SSL certificate provisioned automatically  
✅ HTTPS enabled automatically  
✅ CDN caching configured automatically  
✅ DDoS protection enabled automatically  

## Post-Deployment Checklist

- [ ] Site loads at `https://swiftherb.com`
- [ ] SSL certificate is active (green lock)
- [ ] Chat functionality works
- [ ] Product recommendations work
- [ ] Affiliate links work
- [ ] robots.txt shows `Disallow: /`
- [ ] All pages load correctly

---

**Ready? Start with Step 1 and work through each step!** 🚀
