# 🚀 Final Deployment Steps

## ✅ What's Done

1. ✅ **Static site deployed**: https://488156f8.swiftherb.pages.dev
2. ✅ **Static export configured**: No cache file issues
3. ✅ **Chat API Worker created**: Ready to deploy

## Next Steps

### Step 1: Deploy Chat API Worker

```bash
cd workers

# Login to Cloudflare (if not already)
npx wrangler login

# Deploy chat API worker
npx wrangler deploy src/chat.ts --config wrangler-chat.toml --name swiftherb-chat-api
```

**After deployment, you'll get a URL like:**
`https://swiftherb-chat-api.YOUR_SUBDOMAIN.workers.dev`

### Step 2: Set Worker Environment Variables

```bash
cd workers

# Set DeepSeek API key (required)
npx wrangler secret put DEEPSEEK_API_KEY --config wrangler-chat.toml
# Enter your DeepSeek API key when prompted

# Optional: Set API URL (defaults to https://api.deepseek.com/v1/chat/completions)
npx wrangler secret put DEEPSEEK_API_URL --config wrangler-chat.toml

# Optional: Set model (defaults to deepseek-chat)
npx wrangler secret put DEEPSEEK_MODEL --config wrangler-chat.toml
```

### Step 3: Update Pages Environment Variables

1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **swiftherb** → **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_CHAT_API_URL = https://swiftherb-chat-api.YOUR_SUBDOMAIN.workers.dev
NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref_here
NEXT_PUBLIC_SITE_URL = https://swiftherb.com
```

4. **Redeploy Pages** (or wait for auto-redeploy)

### Step 4: Redeploy Static Site

After setting environment variables, rebuild and redeploy:

```bash
# Build with new environment variables
pnpm build

# Redeploy
npx wrangler pages deploy out --project-name=swiftherb
```

### Step 5: Connect Custom Domain

1. Go to **Workers & Pages** → **swiftherb** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `swiftherb.com`
4. Cloudflare will automatically create DNS records
5. Wait 5-10 minutes for DNS propagation
6. SSL certificate will be provisioned automatically

## Architecture Summary

```
┌─────────────────────┐
│  Static Site (SSG)  │─── Cloudflare Pages
│  /out directory     │    https://swiftherb.com
│  1.1MB              │
└──────────┬──────────┘
           │
           │ API calls
           ▼
┌─────────────────────┐
│  Chat API Worker    │─── Cloudflare Workers
│  /api/chat          │    Edge computing
└─────────────────────┘
```

## Benefits

✅ **No cache issues** - Static files only (1.1MB vs 64MB)  
✅ **Fast deployment** - Static export is quick  
✅ **Edge API** - Worker runs at edge for low latency  
✅ **Cost effective** - Static hosting + Workers free tier  
✅ **Scalable** - Automatic scaling  

## Testing

After deployment:

1. **Test static site**: Visit https://488156f8.swiftherb.pages.dev
2. **Test chat API**: 
   ```bash
   curl -X POST https://swiftherb-chat-api.YOUR_SUBDOMAIN.workers.dev \
     -H "Content-Type: application/json" \
     -d '{"messages":[],"userMessage":"test"}'
   ```
3. **Test custom domain**: Visit https://swiftherb.com (after DNS propagates)

## Troubleshooting

### Chat not working
- Check `NEXT_PUBLIC_CHAT_API_URL` is set correctly
- Verify worker is deployed and accessible
- Check browser console for errors

### Environment variables not working
- Rebuild and redeploy after adding variables
- Variables starting with `NEXT_PUBLIC_` are available in browser
- Check Cloudflare Pages → Settings → Environment Variables

---

**Ready to complete deployment? Deploy the chat worker next!** 🚀
