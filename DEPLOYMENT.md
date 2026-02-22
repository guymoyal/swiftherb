# Production Deployment Guide

**Last Updated:** February 15, 2026

## 🚀 Quick Deploy Steps

### 1. Update Production URL

Update `.env` with your production domain:
```env
NEXT_PUBLIC_SITE_URL=https://swiftherb.com
# or
NEXT_PUBLIC_SITE_URL=https://swiftherb.pages.dev
```

### 2. Deploy Next.js App (Cloudflare Pages)

```bash
npm run deploy:pages
```

This will:
- Clean build artifacts
- Build the Next.js app
- Deploy to Cloudflare Pages

### 3. Deploy Workers (if needed)

```bash
# Deploy products API worker
npm run deploy:worker

# Deploy update-products worker (already deployed)
npm run deploy:update-worker
```

### 4. Set Environment Variables in Cloudflare

Go to Cloudflare Dashboard → Pages → swiftherb → Settings → Environment Variables

Add these **public** variables (visible to browser):
- `NEXT_PUBLIC_SITE_URL` = `https://swiftherb.com`
- `NEXT_PUBLIC_ADMITAD_W_ID` = (when available)
- `NEXT_PUBLIC_ADMITAD_C_ID` = (when available)
- `NEXT_PUBLIC_WORKERS_API_URL` = `https://swiftherb-products-api.your-subdomain.workers.dev`

**Note:** Secrets (DEEPSEEK_API_KEY, ADMITAD_CLIENT_SECRET, etc.) should be set via `wrangler secret put` for Workers, not Pages.

---

## 📋 Pre-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_SITE_URL` in `.env` to production URL
- [ ] Build succeeds: `npm run build`
- [ ] Test locally: `npm run dev`
- [ ] All environment variables are set
- [ ] Workers are deployed and working
- [ ] Cloudflare Pages project is created

---

## 🔧 Manual Deployment Steps

### Option 1: Using npm script (Recommended)

```bash
npm run deploy:pages
```

### Option 2: Manual commands

```bash
# Clean and build
rm -rf .next out
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name=swiftherb
```

---

## 🌐 Setting Up Custom Domain

1. Go to Cloudflare Dashboard → Pages → swiftherb
2. Click "Custom domains"
3. Add your domain (e.g., `swiftherb.com`)
4. Update DNS records as instructed

---

## 🔐 Environment Variables Setup

### For Cloudflare Pages (Public Variables)

Set in Cloudflare Dashboard → Pages → Settings → Environment Variables

### For Cloudflare Workers (Secrets)

```bash
# Products API Worker
cd workers
npx wrangler secret put DEEPSEEK_API_KEY --name swiftherb-products-api
npx wrangler secret put ADMITAD_CLIENT_ID --name swiftherb-products-api
npx wrangler secret put ADMITAD_CLIENT_SECRET --name swiftherb-products-api

# Update Products Worker
npx wrangler secret put ADMITAD_CLIENT_ID --config wrangler-update.toml --name swiftherb-update-products
npx wrangler secret put ADMITAD_CLIENT_SECRET --config wrangler-update.toml --name swiftherb-update-products
npx wrangler secret put ADMITAD_BASE64_HEADER --config wrangler-update.toml --name swiftherb-update-products
```

---

## ✅ Post-Deployment Verification

1. **Check site is live:**
   - Visit your production URL
   - Test homepage loads
   - Test chat interface

2. **Check Workers:**
   ```bash
   # Test products API
   curl https://swiftherb-products-api.your-subdomain.workers.dev/products/magnesium_glycinate
   
   # Check update worker logs
   npx wrangler tail swiftherb-update-products
   ```

3. **Test functionality:**
   - AI chat works
   - Product cards display
   - Affiliate links work
   - Images load correctly

---

## 🐛 Troubleshooting

### Build fails
- Check for TypeScript errors: `npx tsc --noEmit`
- Check for linting errors: `npm run lint`
- Ensure all dependencies are installed: `npm install`

### Deployment fails
- Check Cloudflare authentication: `npx wrangler whoami`
- Verify project name exists in Cloudflare Pages
- Check build output directory exists: `ls -la out/`

### Site loads but features don't work
- Check environment variables are set in Cloudflare Dashboard
- Verify Workers are deployed and accessible
- Check browser console for errors

---

## 📊 Monitoring

After deployment, monitor:
- Cloudflare Pages analytics
- Worker logs: `npx wrangler tail swiftherb-products-api`
- Error rates in Cloudflare Dashboard

---

## 🔄 Continuous Deployment

To set up automatic deployments:

1. Connect GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `out`
4. Add environment variables in dashboard
5. Deploy automatically on every push to `main`
