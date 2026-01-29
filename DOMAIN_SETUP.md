# SwiftHerb.com Domain Setup Guide

## ✅ Domain Added to Cloudflare

Great! You've added `swiftherb.com` to Cloudflare. Now let's connect it to your Cloudflare Pages deployment.

## Step 1: Deploy Your Site to Cloudflare Pages

### Option A: Via Dashboard (Recommended)

1. **Push your code to Git** (if not already):
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Go to Cloudflare Dashboard**:
   - Visit https://dash.cloudflare.com
   - Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

3. **Connect Repository**:
   - Select your Git provider (GitHub/GitLab)
   - Choose your `swiftherb` repository
   - Click **Begin setup**

4. **Configure Build Settings**:
   ```
   Project name: swiftherb
   Framework preset: Next.js (Static HTML Export)
   Build command: pnpm build
   Build output directory: .next
   Root directory: /
   ```

5. **Add Environment Variables**:
   Click **Environment variables** and add:
   ```env
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
   DEEPSEEK_MODEL=deepseek-chat
   NEXT_PUBLIC_PARTNERIZE_CAMREF=your_camref_here
   NEXT_PUBLIC_SITE_URL=https://swiftherb.com
   ```

6. **Deploy**:
   - Click **Save and Deploy**
   - Wait for deployment to complete
   - Your site will be live at `https://swiftherb-xxxxx.pages.dev`

## Step 2: Connect Custom Domain

1. **In Cloudflare Pages Dashboard**:
   - Go to your project → **Custom domains**
   - Click **Set up a custom domain**

2. **Add Domain**:
   - Enter: `swiftherb.com`
   - Also add: `www.swiftherb.com` (optional, but recommended)

3. **DNS Configuration**:
   Cloudflare will automatically configure DNS records. You should see:
   - `CNAME swiftherb.com` → pointing to your Pages deployment
   - `CNAME www.swiftherb.com` → pointing to your Pages deployment

4. **SSL/TLS**:
   - Cloudflare will automatically provision SSL certificates
   - This usually takes a few minutes
   - Status will show "Active" when ready

## Step 3: Update Environment Variables

After connecting the domain, update your environment variables:

1. Go to **Pages** → **swiftherb** → **Settings** → **Environment variables**
2. Update `NEXT_PUBLIC_SITE_URL` to: `https://swiftherb.com`
3. Redeploy (or wait for automatic redeploy)

## Step 4: Verify Everything Works

### Check DNS Propagation:
```bash
# Check if domain resolves
dig swiftherb.com
# or
nslookup swiftherb.com
```

### Test Your Site:
1. Visit `https://swiftherb.com`
2. Check `https://swiftherb.com/robots.txt` (should show `Disallow: /`)
3. Test the chat functionality
4. Verify product recommendations work
5. Test affiliate links

### Check SSL:
- Visit `https://swiftherb.com` (should show secure lock icon)
- Check SSL status in Cloudflare Dashboard → SSL/TLS

## Step 5: Update robots.txt (When Ready to Launch)

When you're ready to allow search engines:

1. Edit `public/robots.txt`:
   ```txt
   User-agent: *
   Allow: /
   
   Sitemap: https://swiftherb.com/sitemap.xml
   ```

2. Commit and push:
   ```bash
   git add public/robots.txt
   git commit -m "Update robots.txt for launch"
   git push origin main
   ```

3. Cloudflare Pages will auto-deploy

## DNS Records Reference

Your Cloudflare DNS should have:

```
Type    Name              Content                    Proxy
CNAME   swiftherb.com     swiftherb-xxxxx.pages.dev  Proxied
CNAME   www               swiftherb-xxxxx.pages.dev  Proxied
```

## Troubleshooting

### Domain Not Resolving
- Wait 5-10 minutes for DNS propagation
- Check DNS records in Cloudflare Dashboard
- Ensure records are "Proxied" (orange cloud icon)

### SSL Not Working
- Wait a few minutes for certificate provisioning
- Check SSL/TLS settings in Cloudflare Dashboard
- Ensure SSL/TLS encryption mode is "Full" or "Full (strict)"

### Site Shows "Not Found"
- Verify build completed successfully
- Check build logs in Cloudflare Pages
- Ensure custom domain is connected correctly

### Environment Variables Not Working
- Redeploy after adding variables
- Check variable names are correct (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix for client-side variables

## Post-Deployment Checklist

- [ ] Site loads at `https://swiftherb.com`
- [ ] SSL certificate is active (green lock)
- [ ] `www.swiftherb.com` redirects (if configured)
- [ ] Chat functionality works
- [ ] Product recommendations work
- [ ] Affiliate links work
- [ ] robots.txt is accessible
- [ ] All pages load correctly (/about, /privacy, /terms)

## Next Steps

1. **Monitor Performance**: Check Cloudflare Analytics
2. **Set up Analytics**: Add privacy-friendly analytics if desired
3. **Configure Caching**: Cloudflare automatically caches static assets
4. **Set up Redirects**: Configure www → non-www (or vice versa) if needed

---

**Your site will be live at `https://swiftherb.com` once deployment completes and DNS propagates!** 🚀
