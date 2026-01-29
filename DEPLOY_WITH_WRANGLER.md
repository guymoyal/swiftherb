# Deploy SwiftHerb with Wrangler CLI

## Quick Deploy Steps

### Step 1: Login to Cloudflare (if not already)

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

### Step 2: Build Your Project

```bash
# Make sure dependencies are installed
pnpm install

# Build for production
pnpm build
```

### Step 3: Deploy to Cloudflare Pages

```bash
# Deploy the .next directory
npx wrangler pages deploy .next --project-name=swiftherb
```

**Note:** If the project doesn't exist, wrangler will create it automatically.

### Step 4: Set Environment Variables

After first deployment, set environment variables:

```bash
# Set environment variables for production
npx wrangler pages secret put DEEPSEEK_API_KEY --project-name=swiftherb
# Enter your API key when prompted

npx wrangler pages secret put DEEPSEEK_API_URL --project-name=swiftherb
# Enter: https://api.deepseek.com/v1/chat/completions

npx wrangler pages secret put DEEPSEEK_MODEL --project-name=swiftherb
# Enter: deepseek-chat

npx wrangler pages secret put NEXT_PUBLIC_PARTNERIZE_CAMREF --project-name=swiftherb
# Enter your camref

npx wrangler pages secret put NEXT_PUBLIC_SITE_URL --project-name=swiftherb
# Enter: https://swiftherb.com
```

**Or use the dashboard:**
- Go to Cloudflare Dashboard → Workers & Pages → swiftherb
- Settings → Environment Variables
- Add variables there (easier than CLI)

### Step 5: Connect Custom Domain

After deployment, connect your domain:

**Option A: Via Dashboard (Easier)**
1. Go to Cloudflare Dashboard → Workers & Pages → swiftherb
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `swiftherb.com`
5. Cloudflare will automatically create DNS records

**Option B: Via CLI**
```bash
# Add custom domain
npx wrangler pages domain add swiftherb.com --project-name=swiftherb

# Add www subdomain (optional)
npx wrangler pages domain add www.swiftherb.com --project-name=swiftherb
```

## Full Deployment Script

```bash
#!/bin/bash
# Quick deploy script

echo "🔨 Building project..."
pnpm build

echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy .next --project-name=swiftherb

echo "✅ Deployment complete!"
echo "Visit your site at: https://swiftherb.pages.dev"
```

## Useful Wrangler Commands

```bash
# List all Pages projects
npx wrangler pages project list

# View deployment history
npx wrangler pages deployment list --project-name=swiftherb

# View specific deployment
npx wrangler pages deployment tail --project-name=swiftherb

# List environment variables
npx wrangler pages secret list --project-name=swiftherb

# Delete a secret
npx wrangler pages secret delete SECRET_NAME --project-name=swiftherb

# View project info
npx wrangler pages project get swiftherb
```

## Troubleshooting

### "Not authenticated"
```bash
npx wrangler login
```

### "Project not found"
- The project will be created automatically on first deploy
- Or create it manually in the dashboard first

### "Build failed"
- Make sure `pnpm build` works locally first
- Check Node.js version (Next.js 15 requires Node 18+)

### Environment Variables Not Working
- Secrets set via CLI are only for production
- Use dashboard for easier management
- Redeploy after adding variables

## Post-Deployment

After deploying:

1. **Check your site**: Visit the Pages URL shown after deployment
2. **Connect domain**: Add custom domain in dashboard or via CLI
3. **Verify DNS**: Check DNS records were created automatically
4. **Test SSL**: Wait 2-5 minutes for SSL certificate

---

**Ready to deploy? Run the commands above!** 🚀
