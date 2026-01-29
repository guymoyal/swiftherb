# SwiftHerb Cloudflare Pages Deployment

## Quick Deploy to Cloudflare Pages

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Push your code to Git**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Cloudflare Dashboard**:
   - Visit [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

3. **Connect Repository**:
   - Select your Git provider (GitHub/GitLab)
   - Choose your repository
   - Click **Begin setup**

4. **Configure Build Settings**:
   ```
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
   NEXT_PUBLIC_SITE_URL=https://your-domain.pages.dev
   ```

6. **Deploy**:
   - Click **Save and Deploy**
   - Your site will be live at `https://your-project.pages.dev`

### Option 2: Deploy via Wrangler CLI

```bash
# 1. Install Wrangler (if not already installed)
pnpm add -D wrangler

# 2. Login to Cloudflare
npx wrangler login

# 3. Build your project
pnpm build

# 4. Deploy to Cloudflare Pages
npx wrangler pages deploy .next --project-name=swiftherb
```

## Build Locally First (Test Before Deploying)

```bash
# 1. Install dependencies
pnpm install

# 2. Build the project
pnpm build

# 3. Test production build locally
pnpm start

# Visit http://localhost:3000 to verify everything works
```

## Required Environment Variables

Set these in Cloudflare Pages dashboard (Settings → Environment Variables):

```env
# AI Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL=deepseek-chat

# Affiliate
NEXT_PUBLIC_PARTNERIZE_CAMREF=your_camref_here

# Site URL (update with your actual Cloudflare Pages URL)
NEXT_PUBLIC_SITE_URL=https://your-project.pages.dev
```

### Optional Variables:

```env
# Cloudflare Workers API (if using)
NEXT_PUBLIC_WORKERS_API_URL=https://swiftherb-api.your-subdomain.workers.dev
```

## Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] Environment variables added to Cloudflare Pages
- [ ] `robots.txt` is set to disallow (pre-launch)
- [ ] Build succeeds locally (`pnpm build`)
- [ ] Production build works locally (`pnpm start`)
- [ ] No console errors in browser
- [ ] API endpoints work correctly

## Post-Deployment Verification

```bash
# 1. Check robots.txt
curl https://your-project.pages.dev/robots.txt

# 2. Check homepage loads
curl https://your-project.pages.dev

# 3. Test chat functionality
# Visit your site and test the chat interface
```

## Custom Domain Setup

1. Go to Cloudflare Pages → Your Project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_SITE_URL` environment variable with your custom domain

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Environment Variables Not Working

- Make sure variables are set in Cloudflare Pages dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix for client-side variables

### Deployment Fails

- Check build logs in Cloudflare Pages dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (Next.js 15 requires Node 18+)
- Check build command and output directory settings

## Quick Reference Commands

```bash
# Development
pnpm dev                    # Start dev server

# Build
pnpm build                  # Build for production
pnpm start                  # Start production server locally

# Deploy
npx wrangler pages deploy .next --project-name=swiftherb
```

## Next Steps After Deployment

1. **Verify robots.txt**: Should show `Disallow: /`
2. **Test all features**: Chat, product cards, affiliate links
3. **Monitor errors**: Check Cloudflare Pages logs
4. **Set up custom domain**: Add in Cloudflare Pages settings
5. **SSL**: Automatically handled by Cloudflare

---

**Ready to deploy?** Push to Git and connect to Cloudflare Pages!
