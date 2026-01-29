# SwiftHerb Cloudflare Workers

This directory contains the Cloudflare Workers backend for SwiftHerb, handling product data retrieval from Cloudflare KV.

## Setup

### 1. Install Dependencies

```bash
cd workers
pnpm install
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Create KV Namespace

```bash
wrangler kv:namespace create PRODUCTS
```

This will output something like:
```
🌀  Creating namespace with title "swiftherb-api-PRODUCTS"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "PRODUCTS", id = "abc123def456..." }
```

### 4. Update wrangler.toml

Add the namespace ID to `workers/wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "PRODUCTS"
id = "your_namespace_id_here"
```

### 5. Populate KV with Product Data

From the project root:

```bash
# Generate population script
pnpm tsx scripts/populate-kv.ts

# Run the generated commands or use bulk upload
wrangler kv:bulk put --binding=PRODUCTS ../data/kv-products.json
```

### 6. Test Locally

```bash
cd workers
pnpm dev
```

The worker will be available at `http://localhost:8787`

### 7. Deploy

```bash
cd workers
pnpm deploy
```

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "swiftherb-api"
}
```

### GET /products/:slug
Get a single product by slug.

**Example:** `GET /products/magnesium_glycinate`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "MAG001",
    "title": "Doctor's Best Magnesium Glycinate",
    "price": "$18.50",
    "image": "https://images.iherb.com/m/DRB-00087-5.jpg",
    "description": "High absorption magnesium...",
    "category": "Minerals",
    "slug": "magnesium_glycinate"
  }
}
```

### POST /products/batch
Get multiple products by slugs.

**Request Body:**
```json
{
  "slugs": ["magnesium_glycinate", "vitamin_d3", "ashwagandha"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    { /* product 1 */ },
    { /* product 2 */ },
    { /* product 3 */ }
  ]
}
```

### GET /products/search?q=query
Search products (placeholder - requires index).

**Note:** KV doesn't support full-text search. For production search, consider:
- Cloudflare D1 (SQL database)
- External search service (Algolia, Typesense)
- Maintain a search index in KV

## Environment Variables

Set in Cloudflare Dashboard or `wrangler.toml`:

- `ENVIRONMENT`: `production` or `development`

## KV Key Structure

- Format: `prod_{slug}`
- Example: `prod_magnesium_glycinate`
- Value: JSON string of product data

## Product Schema

```typescript
{
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  category: string;
  slug: string;
  iherb_url?: string;
}
```

## Development

### Local Development

```bash
cd workers
pnpm dev
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:8787/health

# Get product
curl http://localhost:8787/products/magnesium_glycinate

# Batch request
curl -X POST http://localhost:8787/products/batch \
  -H "Content-Type: application/json" \
  -d '{"slugs": ["magnesium_glycinate", "vitamin_d3"]}'
```

## Production Deployment

1. Deploy worker:
   ```bash
   cd workers
   pnpm deploy
   ```

2. Set environment variable in Next.js:
   ```env
   NEXT_PUBLIC_WORKERS_API_URL=https://swiftherb-api.your-subdomain.workers.dev
   ```

3. Update `lib/kv.ts` to use Workers API in production.

## Troubleshooting

### KV Namespace Not Found
- Verify namespace ID in `wrangler.toml`
- Check namespace exists: `wrangler kv:namespace list`

### Products Not Found
- Verify products are populated: `wrangler kv:key list --binding=PRODUCTS`
- Check key format: should be `prod_{slug}`

### CORS Issues
- CORS headers are included in the worker
- Verify `Access-Control-Allow-Origin` is set correctly
