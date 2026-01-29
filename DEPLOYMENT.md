# SwiftHerb Deployment Guide

> **Quick Deploy**: See `DEPLOY_COMMANDS.md` for step-by-step commands

## Pre-Launch Checklist

### SEO & Crawling

- [x] **robots.txt** - Currently disallows all crawlers (`public/robots.txt`)
- [x] **sitemap.xml** - Placeholder created (`public/sitemap.xml`)
- [ ] Update robots.txt when ready to launch (remove `Disallow: /`)
- [ ] Generate proper sitemap.xml with all pages
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools

### Environment Variables

Ensure all environment variables are set in your hosting platform:

```env
# AI Configuration
DEEPSEEK_API_KEY=your_production_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL=deepseek-chat

# Affiliate
NEXT_PUBLIC_PARTNERIZE_CAMREF=your_camref_here

# Site URL
NEXT_PUBLIC_SITE_URL=https://swiftherb.com

# Cloudflare Workers (if using)
NEXT_PUBLIC_WORKERS_API_URL=https://swiftherb-api.your-subdomain.workers.dev
```

### Cloudflare Pages Deployment

1. **Connect Repository**:
   - Go to Cloudflare Dashboard → Workers & Pages → Pages
   - Click "Create application" → "Connect to Git"
   - Select your Git provider and repository

2. **Build Settings**:
   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: pnpm build
   Build output directory: .next
   Root directory: /
   ```

3. **Environment Variables**:
   - Add in Pages → Settings → Environment Variables
   - See `DEPLOY_COMMANDS.md` for required variables

4. **Deploy**:
   - Click "Save and Deploy"
   - Your site will be live at `https://your-project.pages.dev`

5. **Custom Domain**:
   - Go to Pages → Your Project → Custom domains
   - Add your domain and follow DNS instructions

### Post-Deployment

1. **Verify robots.txt**:
   - Visit `https://yourdomain.com/robots.txt`
   - Should show `Disallow: /` during pre-launch

2. **Test API Endpoints**:
   - Verify chat API works
   - Check product recommendations
   - Test affiliate links

3. **Performance Check**:
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Optimize images if needed

4. **Security**:
   - Enable HTTPS (automatic on most platforms)
   - Check security headers
   - Verify API keys are not exposed

### When Ready to Launch

1. **Update robots.txt**:
   ```txt
   User-agent: *
   Allow: /
   
   Sitemap: https://swiftherb.com/sitemap.xml
   ```

2. **Generate Sitemap**:
   - Use Next.js sitemap generation
   - Or manually create with all pages:
     - `/` (home)
     - `/about`
     - `/privacy`
     - `/terms`

3. **Submit to Search Engines**:
   - Google Search Console
   - Bing Webmaster Tools

4. **Analytics**:
   - Set up Google Analytics (if using)
   - Configure conversion tracking
   - Set up error tracking (Sentry, etc.)

### Monitoring

- **Uptime Monitoring**: Use UptimeRobot or similar
- **Error Tracking**: Sentry or similar
- **Performance**: Vercel Analytics or Cloudflare Analytics
- **User Analytics**: Privacy-friendly analytics (Plausible, etc.)

### Rollback Plan

If something goes wrong:

1. **Vercel**: Use deployment history to rollback
2. **Cloudflare Pages**: Use previous deployment
3. **Netlify**: Use deploy log to rollback

---

**Current Status**: Pre-launch (robots.txt disallows all crawlers)
