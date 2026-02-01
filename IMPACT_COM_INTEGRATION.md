# Impact.com Product Catalog Integration

## ✅ Yes! Impact.com Has Product Data Feeds

Impact.com offers **product catalogs** with:
- Product information (titles, descriptions)
- Images
- Pricing
- Metadata
- API access for catalog management

## How It Works

### Product Catalogs in Impact.com

1. **Catalogs are created by brands** (like iHerb) and imported into Impact.com
2. **Partners can access catalogs** through the Impact.com API
3. **API endpoints available**:
   - List all catalogs
   - Retrieve specific catalog
   - Get individual catalog items
   - Bulk operations

### API Access

**Documentation**: https://integrations.impact.com/impact-brand/reference/catalogs-overview

**Endpoints**:
- `GET /catalogs` - List all available catalogs
- `GET /catalogs/{id}` - Get specific catalog
- `GET /catalogs/{id}/items` - Get catalog items
- `POST /catalogs/{id}/items` - Create catalog item
- `PUT /catalogs/{id}/items/{itemId}` - Update item
- `DELETE /catalogs/{id}/items/{itemId}` - Delete item

## Requirements

### 1. Impact.com Partner Account
- You need to be a **partner** (affiliate) in Impact.com
- Apply to iHerb's program through Impact.com
- Get approved as an affiliate

### 2. API Credentials
- API key/authentication from Impact.com
- Access to partner dashboard
- Catalog access permissions

### 3. Check if iHerb Uses Impact.com
- Not all brands use Impact.com
- iHerb might use Partnerize, Impact.com, or another network
- Check iHerb's affiliate program page

## Implementation Steps

### Step 1: Verify iHerb Uses Impact.com

Check iHerb's affiliate program:
- Visit iHerb's affiliate/partner page
- See which network they use (Partnerize, Impact.com, etc.)
- If Impact.com, proceed to Step 2

### Step 2: Apply to iHerb Program via Impact.com

1. Sign up at https://impact.com
2. Search for "iHerb" in their marketplace
3. Apply to the program
4. Wait for approval

### Step 3: Get API Access

1. Log into Impact.com partner dashboard
2. Go to API/Integrations section
3. Generate API credentials
4. Get catalog access permissions

### Step 4: Fetch Product Catalog

Update `workers/src/update-products.ts`:

```typescript
async function fetchProductUpdates(env: Env): Promise<ProductUpdate[]> {
  const IMPACT_API_KEY = env.IMPACT_API_KEY;
  const IMPACT_API_URL = env.IMPACT_API_URL || "https://api.impact.com";
  
  // 1. Get iHerb catalog ID
  const catalogsResponse = await fetch(`${IMPACT_API_URL}/catalogs`, {
    headers: {
      'Authorization': `Bearer ${IMPACT_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  const catalogs = await catalogsResponse.json();
  const iherbCatalog = catalogs.find(c => c.brandName === 'iHerb');
  
  if (!iherbCatalog) {
    throw new Error('iHerb catalog not found');
  }
  
  // 2. Fetch all catalog items
  const itemsResponse = await fetch(
    `${IMPACT_API_URL}/catalogs/${iherbCatalog.id}/items`,
    {
      headers: {
        'Authorization': `Bearer ${IMPACT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const items = await itemsResponse.json();
  
  // 3. Transform to KV format
  return items.map(item => ({
    slug: item.sku || item.id.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    product: {
      id: item.sku || item.id,
      title: item.name,
      price: item.price,
      image: item.imageUrl,
      description: item.description,
      category: item.category,
      slug: item.sku || item.id.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      iherb_url: item.productUrl,
      updated_at: new Date().toISOString(),
    }
  }));
}
```

### Step 5: Update Worker Environment

Add to `workers/wrangler-update.toml`:

```toml
# Environment variables
[vars]
ENVIRONMENT = "production"

# Set via: wrangler secret put IMPACT_API_KEY
# IMPACT_API_URL - Optional, defaults to https://api.impact.com
```

Set the secret:
```bash
cd workers
npx wrangler secret put IMPACT_API_KEY --config wrangler-update.toml --name swiftherb-update-products
```

## Comparison: Impact.com vs Partnerize

| Feature | Impact.com | Partnerize |
|---------|-----------|------------|
| Product Catalog API | ✅ Yes | ❓ Unknown |
| Product Data Feeds | ✅ Yes | ❓ Check |
| Affiliate Links | ✅ Yes | ✅ Yes |
| API Documentation | ✅ Available | ❓ Check |
| iHerb Integration | ❓ Check | ✅ Known |

## Next Steps

1. **Check if iHerb uses Impact.com**:
   - Visit iHerb affiliate page
   - Check which network they use

2. **If iHerb uses Impact.com**:
   - Sign up at impact.com
   - Apply to iHerb program
   - Get API access
   - Implement catalog fetching

3. **If iHerb uses Partnerize**:
   - Check if Partnerize has product catalog API
   - Use Partnerize if available
   - Otherwise, use web scraping

4. **If neither has product API**:
   - Use web scraping (legal, respectful)
   - Or start with manual/mock data

## Resources

- **Impact.com API Docs**: https://integrations.impact.com/impact-brand/reference/catalogs-overview
- **Impact.com Partner Help**: https://help.impact.com/en/support/solutions/articles/155000001053-impact-com-api-explained-for-partners
- **Data Feeds Guide**: https://help.impact.com/en/support/solutions/articles/155000001201-introduction-to-data-feeds-for-partners

---

**Action**: Check iHerb's affiliate program to see which network they use!
