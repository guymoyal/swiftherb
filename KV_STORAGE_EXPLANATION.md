# Cloudflare KV Storage - How We Use It

## What is Cloudflare KV?

**KV (Key-Value)** is Cloudflare's distributed, global key-value database. Think of it like a simple database where:
- **Keys** = unique identifiers (like `prod_vitamin_d3_5000iu`)
- **Values** = data stored as JSON strings (like product information)

## Why We Use KV for Products

1. **Fast Global Access**: KV is replicated globally, so products load instantly worldwide
2. **Cost-Effective**: Much cheaper than a traditional database for read-heavy workloads
3. **No Cold Starts**: Unlike databases, KV has no connection overhead
4. **Perfect for Static-ish Data**: Product catalogs don't change every second

## How We Store Products in KV

### Key Format
```
prod_{slug}
```

**Examples:**
- `prod_vitamin_d3_5000iu`
- `prod_omega_3_fish_oil`
- `prod_multivitamin_women`

### Value Format (JSON)
```json
{
  "id": "VIT-D3-5000",
  "title": "Vitamin D3 5000 IU",
  "price": "$12.99",
  "image": "https://images.iherb.com/...",
  "description": "High-potency vitamin D3 supplement...",
  "category": "Vitamins",
  "slug": "vitamin_d3_5000iu",
  "iherb_url": "https://www.iherb.com/...",
  "updated_at": "2026-01-31T12:00:00Z"
}
```

## The Update Process

### 1. Fetch Products
- Worker runs every 3 hours (cron: `0 */3 * * *`)
- Fetches product catalogs from iHerb API (if configured) or uses mock data
- Transforms data to our format

### 2. Store in KV
- Each product is stored as: `prod_{slug}` → JSON
- Batch updates (100 products at a time) for efficiency
- Only updates changed products (checks existing data first)

### 3. Read from KV
- Other workers (`swiftherb-products-api`) read from KV
- Frontend calls the products API
- Products API returns data from KV

## KV Namespace

**Namespace ID**: `cc09538377c34c08916ac38a0f5846ed`
**Binding Name**: `PRODUCTS`

This namespace is shared across:
- `swiftherb-update-products` (writes products)
- `swiftherb-products-api` (reads products)
- `swiftherb-chat-api` (reads products for AI recommendations)

## Example Flow

```
1. iHerb API (or mock data)
   ↓
2. swiftherb-update-products Worker
   ↓ (fetches products, transforms data)
3. Cloudflare KV Storage
   ↓ (stores: prod_{slug} → JSON)
4. swiftherb-products-api Worker
   ↓ (reads from KV)
5. Your Website Frontend
   ↓ (displays product cards)
```

## Benefits

✅ **Fast**: Products load in milliseconds globally
✅ **Scalable**: Handles millions of reads easily
✅ **Cost-Effective**: Pay only for what you use
✅ **Reliable**: Cloudflare's global infrastructure
✅ **Simple**: No database management needed

## Limitations

⚠️ **No Complex Queries**: Can't do SQL-like searches (we handle this in code)
⚠️ **Eventual Consistency**: Updates may take a few seconds to propagate globally
⚠️ **Size Limits**: 25MB per value (products are much smaller)

## Monitoring

Check logs with:
```bash
npx wrangler tail swiftherb-update-products --format pretty
```

View KV keys:
```bash
npx wrangler kv:key list --binding=PRODUCTS --namespace-id=cc09538377c34c08916ac38a0f5846ed
```

Get a specific product:
```bash
npx wrangler kv:key get prod_vitamin_d3_5000iu --binding=PRODUCTS --namespace-id=cc09538377c34c08916ac38a0f5846ed
```
