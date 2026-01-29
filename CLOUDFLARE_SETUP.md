# Cloudflare Workers Setup Guide

## ✅ What's Been Completed

I've set up the complete Cloudflare Workers infrastructure:

1. ✅ **Workers project structure** (`workers/` folder)
2. ✅ **API routes** for product data retrieval
3. ✅ **KV integration** code
4. ✅ **Population script** to migrate mock data to KV
5. ✅ **Next.js integration** to use Workers API
6. ✅ **TypeScript configuration** for Workers

## 🚧 What You Need to Do

### Step 1: Fix pnpm Store Issue

First, resolve the pnpm store location issue:

```bash
# Option 1: Reinstall dependencies
pnpm install

# Option 2: Or change global store location
pnpm config set store-dir ~/.pnpm-store --global
pnpm install
```

### Step 2: Install Workers Dependencies

```bash
cd workers
pnpm install
```

This will install:
- `wrangler` - Cloudflare CLI
- `@cloudflare/workers-types` - TypeScript types

### Step 3: Create Cloudflare Account

1. Sign up at [cloudflare.com](https://www.cloudflare.com)
2. Go to Workers & Pages dashboard
3. Get your Account ID from the dashboard

### Step 4: Authenticate Wrangler

```bash
cd workers
wrangler login
```

This will open a browser to authenticate with Cloudflare.

### Step 5: Create KV Namespace

```bash
cd workers
wrangler kv:namespace create PRODUCTS
```

**Important:** Copy the output namespace ID. You'll need it for the next step.

Example output:
```
🌀  Creating namespace with title "swiftherb-api-PRODUCTS"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "PRODUCTS", id = "abc123def456ghi789..." }
```

### Step 6: Update wrangler.toml

Edit `workers/wrangler.toml` and add your namespace ID:

```toml
[[kv_namespaces]]
binding = "PRODUCTS"
id = "your_namespace_id_here"  # Paste the ID from Step 5
```

### Step 7: Populate KV with Product Data

From the project root:

```bash
# Generate the population script
pnpm tsx scripts/populate-kv.ts

# This creates:
# - scripts/kv-populate-commands.sh (shell commands)
# - data/kv-products.json (JSON file for bulk upload)

# Option 1: Use bulk upload (recommended)
cd workers
wrangler kv:bulk put --binding=PRODUCTS ../data/kv-products.json

# Option 2: Run individual commands
bash ../scripts/kv-populate-commands.sh
```

### Step 8: Test Locally

```bash
cd workers
pnpm dev
```

Test the API:
```bash
# Health check
curl http://localhost:8787/health

# Get a product
curl http://localhost:8787/products/magnesium_glycinate

# Batch request
curl -X POST http://localhost:8787/products/batch \
  -H "Content-Type: application/json" \
  -d '{"slugs": ["magnesium_glycinate", "vitamin_d3"]}'
```

### Step 9: Deploy Worker

```bash
cd workers
pnpm deploy
```

This will give you a Workers URL like:
`https://swiftherb-api.your-subdomain.workers.dev`

### Step 10: Configure Next.js

Add to your `.env` file:

```env
NEXT_PUBLIC_WORKERS_API_URL=https://swiftherb-api.your-subdomain.workers.dev
```

## 📋 Checklist

- [ ] Fixed pnpm store issue
- [ ] Installed Workers dependencies (`cd workers && pnpm install`)
- [ ] Created Cloudflare account
- [ ] Authenticated with wrangler (`wrangler login`)
- [ ] Created KV namespace (`wrangler kv:namespace create PRODUCTS`)
- [ ] Updated `workers/wrangler.toml` with namespace ID
- [ ] Populated KV with product data
- [ ] Tested locally (`pnpm dev` in workers folder)
- [ ] Deployed worker (`pnpm deploy`)
- [ ] Added Workers URL to `.env` file

## 🔍 Verification

### Verify KV Namespace

```bash
cd workers
wrangler kv:namespace list
```

### Verify Products in KV

```bash
cd workers
wrangler kv:key list --binding=PRODUCTS
```

You should see keys like:
- `prod_magnesium_glycinate`
- `prod_vitamin_d3`
- `prod_ashwagandha`
- etc.

### Verify Worker Deployment

Visit your Workers URL in browser:
```
https://swiftherb-api.your-subdomain.workers.dev/health
```

Should return:
```json
{"status":"ok","service":"swiftherb-api"}
```

## 🐛 Troubleshooting

### "KV namespace not configured"
- Check `wrangler.toml` has the namespace binding
- Verify namespace ID is correct
- Make sure you're authenticated (`wrangler login`)

### "Product not found"
- Verify products are in KV (`wrangler kv:key list`)
- Check key format: should be `prod_{slug}`
- Ensure slug matches (lowercase, underscores)

### CORS Issues
- CORS headers are included in the worker
- Check browser console for specific errors

### Local Development Not Working
- Make sure Workers dev server is running (`pnpm dev`)
- Check port 8787 is available
- Verify `WORKERS_API_URL=http://localhost:8787` in `.env`

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/kv/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## 🎯 Next Steps After Setup

Once Workers is deployed:

1. Update `lib/kv.ts` to use Workers API in production
2. Test product fetching from Next.js app
3. Monitor Workers analytics in Cloudflare dashboard
4. Consider adding caching for frequently accessed products
5. Set up monitoring and error tracking

---

**Need Help?** Check the `workers/README.md` for detailed API documentation.
