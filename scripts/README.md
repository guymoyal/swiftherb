# SwiftHerb Scripts

Utility scripts for managing the SwiftHerb project.

## KV Population Script

### `populate-kv.ts`

Populates Cloudflare KV with product data from the mock database.

### Usage

1. **Set up KV namespace**:
   ```bash
   cd workers
   wrangler kv:namespace create PRODUCTS
   ```

2. **Add namespace ID to `workers/wrangler.toml`**:
   ```toml
   [[kv_namespaces]]
   binding = "PRODUCTS"
   id = "your_namespace_id_here"
   ```

3. **Generate population commands**:
   ```bash
   pnpm tsx scripts/populate-kv.ts
   ```

4. **Run the generated commands** or use bulk upload:
   ```bash
   # Option 1: Run generated shell script
   bash scripts/kv-populate-commands.sh
   
   # Option 2: Use bulk upload with JSON file
   wrangler kv:bulk put --binding=PRODUCTS data/kv-products.json
   ```

5. **Verify**:
   ```bash
   wrangler kv:key list --binding=PRODUCTS
   ```

## Prerequisites

- Cloudflare account
- Wrangler CLI installed (`pnpm add -D wrangler`)
- Authenticated with Cloudflare (`wrangler login`)

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
