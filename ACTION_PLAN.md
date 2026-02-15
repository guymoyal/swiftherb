# Action Plan: Get Product Data & Show Affiliate Links

## ✅ What's Already Built

Your system is **already set up** to:
- ✅ Extract products from AI responses (looks for `[[Product Name]]`)
- ✅ Display product cards with images, prices, descriptions
- ✅ Generate affiliate links
- ✅ Show products when AI mentions them

## 🎯 What You Need to Do Now

### Step 1: Set DeepSeek API Key (Required for Chat)

**Without this, chat won't work:**

```bash
cd /Users/guym/Projects/swiftherb/workers
npx wrangler secret put DEEPSEEK_API_KEY --name swiftherb-chat-api
```

**Get API key**: https://platform.deepseek.com

---

### Step 2: Create KV Namespace for Product Storage

**This stores product data:**

```bash
# Create KV namespace
npx wrangler kv:namespace create "PRODUCTS"

# Copy the namespace ID from output (looks like: abc123def456...)
```

**Then update these files** with the namespace ID:
- `workers/wrangler.toml`
- `workers/wrangler-chat.toml`
- `workers/wrangler-update.toml`

Add this to each file:
```toml
[[kv_namespaces]]
binding = "PRODUCTS"
id = "YOUR_NAMESPACE_ID_HERE"
```

---

### Step 3: Populate Products

**Start with Mock Data (Quick Start):**

```bash
# Populate KV with mock products (50+ products)
pnpm populate-kv
```

This gives you **immediate testing** with real product data structure.

**Alternative: Use iHerb API (if available)**

If iHerb provides an API, you can configure it:
1. Get iHerb API credentials
2. Set the `IHERB_API_KEY` secret:
   ```bash
   cd workers
   npx wrangler secret put IHERB_API_KEY --config wrangler-update.toml --name swiftherb-update-products
   ```
3. The `fetchFromIHerbAPI()` function in `workers/src/update-products.ts` will automatically fetch products

---

### Step 4: Deploy Workers

```bash
# Deploy Products API (serves product data)
cd workers
npx wrangler deploy src/index.ts --name swiftherb-products-api

# Deploy Update Worker (fetches products every 3 hours)
npx wrangler deploy src/update-products.ts --config wrangler-update.toml --name swiftherb-update-products
```

---

## 🔄 How It Works (Current Flow)

1. **User asks**: "Help with anxiety"
2. **AI responds**: "I recommend [[Magnesium Glycinate]], [[Ashwagandha]], and [[L-Theanine]]"
3. **System extracts**: Product names from `[[...]]`
4. **Looks up products**: From KV storage (by slug)
5. **Displays cards**: Shows product images, prices, descriptions
6. **Affiliate links**: Each card has "View on iHerb" with your affiliate link

---

## 📋 Checklist

- [ ] Set DeepSeek API key → Chat works
- [ ] Create KV namespace → Product storage ready
- [ ] Update wrangler configs → Add namespace ID
- [ ] Populate products → Mock data OR configure iHerb API
- [ ] Deploy Products API worker → Serves product data
- [ ] Deploy Update worker → Fetches products automatically
- [ ] Configure iHerb API (if available) → Fetch real products

---

## 🚀 Quick Start (Test Now)

**To test immediately with mock data:**

```bash
# 1. Set DeepSeek API key
cd workers
npx wrangler secret put DEEPSEEK_API_KEY --name swiftherb-chat-api

# 2. Create KV namespace
npx wrangler kv:namespace create "PRODUCTS"
# Copy the ID

# 3. Update wrangler.toml files with namespace ID
# (Edit files manually)

# 4. Deploy Products API
npx wrangler deploy src/index.ts --name swiftherb-products-api

# 5. Populate with mock data
cd ..
pnpm populate-kv

# 6. Test! Chat should now show product cards
```

---

## 🎯 Summary

**Right now:**
- ✅ System is built and ready
- ⏳ Need DeepSeek API key (chat works)
- ⏳ Need KV namespace (product storage)
- ⏳ Need products (mock data OR configure iHerb API)

**The system is ready - you just need to:**
1. Set API keys
2. Create KV storage
3. Populate products (mock for now, real data if iHerb API available)
