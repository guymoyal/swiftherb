# Deploy SwiftHerb with Wrangler - Quick Guide

## ✅ Build Status
Your project builds successfully! Now let's deploy.

## Step 1: Fix Wrangler Authentication

You have an old API token set. Clear it and login fresh:

```bash
# Clear old API tokens
unset CF_API_TOKEN
unset CLOUDFLARE_API_TOKEN

# Login via OAuth (opens browser)
npx wrangler login
```

**Or** if you want to use an API token instead:
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Create a token with "Cloudflare Pages:Edit" permissions
3. Then use: `export CLOUDFLARE_API_TOKEN=your_token_here`

## Step 2: Deploy to Cloudflare Pages

Once logged in:

```bash
# Deploy (project will be created if it doesn't exist)
npx wrangler pages deploy .next --project-name=swiftherb
```

This will:
- Create the Pages project if needed
- Upload your built files
- Give you a URL like: `https://swiftherb.pages.dev`

## Step 3: Set Environment Variables

**Option A: Via Dashboard (Easier)**
1. Go to https://dash.cloudflare.com
2. Workers & Pages → swiftherb → Settings → Environment Variables
3. Add:
   - `DEEPSEEK_API_KEY` = your key
   - `DEEPSEEK_API_URL` = https://api.deepseek.com/v1/chat/completions
   - `DEEPSEEK_MODEL` = deepseek-chat
   - `NEXT_PUBLIC_PARTNERIZE_CAMREF` = your camref
   - `NEXT_PUBLIC_SITE_URL` = https://swiftherb.com

**Option B: Via CLI**
```bash
npx wrangler pages secret put DEEPSEEK_API_KEY --project-name=swiftherb
# Enter your key when prompted
```

## Step 4: Connect Custom Domain

**Via Dashboard:**
1. Go to Workers & Pages → swiftherb → Custom domains
2. Click "Set up a custom domain"
3. Enter: `swiftherb.com`
4. Cloudflare automatically creates DNS records!

**Via CLI:**
```bash
npx wrangler pages domain add swiftherb.com --project-name=swiftherb
```

## Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🔨 Building..."
pnpm build

echo "🚀 Deploying..."
npx wrangler pages deploy .next --project-name=swiftherb

echo "✅ Done! Visit: https://swiftherb.pages.dev"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Troubleshooting

### "Invalid Authorization header"
- Clear old tokens: `unset CF_API_TOKEN CLOUDFLARE_API_TOKEN`
- Login fresh: `npx wrangler login`

### "Project not found"
- First deploy creates the project automatically
- Or create it in dashboard first

### Environment variables not working
- Use dashboard for easier management
- Redeploy after adding variables

---

**Next:** Clear the tokens and login, then deploy! 🚀
