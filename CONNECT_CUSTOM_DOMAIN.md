# Connect swiftherb.com to Your Deployment

## ✅ Good News

Your site is working at: `https://488156f8.swiftherb.pages.dev/`

## Why swiftherb.pages.dev Doesn't Work

`swiftherb.pages.dev` is a **project-level domain** that Cloudflare Pages doesn't automatically activate. You need to either:
1. Set up a custom domain (`swiftherb.com`) - **Recommended**
2. Or use the deployment-specific URL (`488156f8.swiftherb.pages.dev`)

## Solution: Connect swiftherb.com (Recommended)

### Method 1: Via Cloudflare Pages Dashboard (Easiest - Auto-creates DNS)

This is the **easiest method** - Cloudflare will automatically create DNS records for you!

1. **Go to Cloudflare Dashboard**:
   - Visit https://dash.cloudflare.com
   - Navigate to **Workers & Pages** → **swiftherb** project

2. **Go to Custom Domains Tab**:
   - Click on your `swiftherb` project
   - Click **Custom domains** tab (in the top navigation)

3. **Add Custom Domain**:
   - Click **Set up a custom domain** button
   - Enter: `swiftherb.com`
   - Click **Continue**

4. **Cloudflare Will Automatically**:
   - ✅ Create CNAME DNS record
   - ✅ Provision SSL certificate
   - ✅ Configure routing
   - ✅ Set up HTTPS

5. **Wait 5-10 minutes** for DNS propagation and SSL certificate provisioning

6. **Test**: Visit `https://swiftherb.com`

**That's it!** No manual DNS configuration needed - Cloudflare does it all automatically.

### Method 2: Manual DNS Configuration (If Method 1 Doesn't Work)

If you need to manually configure DNS records:

1. **Go to Cloudflare Dashboard** → **DNS** → **Records**

2. **Add CNAME Record**:
   ```
   Type: CNAME
   Name: @ (or swiftherb.com)
   Target: swiftherb.pages.dev
   Proxy status: Proxied (orange cloud) ✅
   TTL: Auto
   ```

3. **Add www Subdomain** (Optional):
   ```
   Type: CNAME
   Name: www
   Target: swiftherb.pages.dev
   Proxy status: Proxied (orange cloud) ✅
   TTL: Auto
   ```

4. **Wait 5-10 minutes** for DNS propagation

5. **Go back to Cloudflare Pages**:
   - **Custom domains** tab
   - Click **Set up a custom domain**
   - Enter: `swiftherb.com`
   - Cloudflare will detect the DNS record and connect it

## Why This Works

When you add a custom domain in Cloudflare Pages:
- Cloudflare creates the DNS records automatically
- Routes traffic from `swiftherb.com` → your Pages deployment
- Provisions SSL certificate automatically
- Enables HTTPS automatically

## DNS Records You Should See (After Setup)

After connecting via Cloudflare Pages dashboard, you should see in **DNS → Records**:

```
Type    Name              Content                          Proxy
CNAME   swiftherb.com     swiftherb.pages.dev             Proxied ✅
CNAME   www               swiftherb.pages.dev             Proxied ✅
```

**Important**: Records should be **Proxied** (orange cloud icon) for Cloudflare CDN and protection.

## Troubleshooting

### "Domain not resolving"
- Wait 5-10 minutes for DNS propagation
- Check DNS records exist in Cloudflare Dashboard
- Ensure records are "Proxied" (orange cloud)

### "SSL certificate pending"
- Wait 2-5 minutes for certificate provisioning
- Check SSL/TLS settings: Should be "Full" or "Full (strict)"
- SSL is automatic with Cloudflare

### "Custom domain not connecting"
- Make sure domain is added in Cloudflare Pages → Custom domains
- Verify DNS records are correct
- Check domain is in same Cloudflare account

## Quick Checklist

- [ ] Site works at `https://488156f8.swiftherb.pages.dev/` ✅
- [ ] Go to Cloudflare Pages → swiftherb → Custom domains
- [ ] Click "Set up a custom domain"
- [ ] Enter `swiftherb.com`
- [ ] Wait 5-10 minutes
- [ ] Test `https://swiftherb.com`

---

**Next Step**: Go to Cloudflare Pages dashboard → Custom domains → Set up `swiftherb.com`!
