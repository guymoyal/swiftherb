# Next Steps - SwiftHerb Admitad Integration

**Last Updated:** February 15, 2026

## ✅ What's Been Completed

### 1. Admitad API Integration
- ✅ Added Admitad API support to `workers/src/update-products.ts`
- ✅ Implemented OAuth2 token fetching (`getAdmitadAccessToken`)
- ✅ Implemented product feed fetching (`fetchFromAdmitad`)
- ✅ Created deeplink generator (`lib/admitad.ts`)
- ✅ Created unified affiliate link system (`lib/affiliate.ts`)
- ✅ Updated `ProductCard` component to use Admitad links

### 2. Cloudflare Worker Secrets
- ✅ Set `ADMITAD_CLIENT_ID` secret
- ✅ Set `ADMITAD_CLIENT_SECRET` secret
- ✅ Set `ADMITAD_BASE64_HEADER` secret
- ✅ Deployed worker: `swiftherb-update-products`

### 3. Configuration Files
- ✅ Updated `.env` with Admitad credentials
- ✅ Updated `workers/wrangler-update.toml` with Admitad config
- ✅ Added Admitad verification meta tag to `app/layout.tsx`

## ⚠️ Current Issue

**Admitad Authentication Error:**
- Error: `"client_id None doesn't exist"`
- This suggests the Admitad credentials need verification/activation
- The code is correct - the issue is with Admitad account status
- **No products are being fetched until Admitad credentials are verified**

## 🔧 What Needs to Be Done

### 1. Verify Admitad Account Status

**⚠️ STATUS:** Admitad authentication is failing. Products are NOT being fetched until credentials are verified.

**To enable Admitad (optional):**
1. Log into https://www.admitad.com
2. Go to API/Developers section
3. Verify your API application is:
   - ✅ Created
   - ✅ Active/Approved
   - ✅ Has API access enabled
4. Confirm the Client ID matches: `lX1AfZ0aYk4xAvdmxEu4bwVpn8ALLj`

**If credentials are incorrect:**
- Update `.env` with correct values
- Update Cloudflare secrets:
  ```bash
  cd workers
  npx wrangler secret put ADMITAD_CLIENT_ID --config wrangler-update.toml --name swiftherb-update-products
  npx wrangler secret put ADMITAD_CLIENT_SECRET --config wrangler-update.toml --name swiftherb-update-products
  npx wrangler secret put ADMITAD_BASE64_HEADER --config wrangler-update.toml --name swiftherb-update-products
  ```
- Redeploy: `npx wrangler deploy src/update-products.ts --config wrangler-update.toml --name swiftherb-update-products`

### 2. Get Additional Admitad IDs (When Available)

Add these to `.env` when you have them:

```env
# iHerb's campaign ID for filtering products
ADMITAD_ADVCAMPAIGN_ID=your_iherb_campaign_id

# Your Ad Space ID for deeplinks
NEXT_PUBLIC_ADMITAD_W_ID=your_ad_space_id

# iHerb's Campaign ID for deeplinks
NEXT_PUBLIC_ADMITAD_C_ID=your_campaign_id
```

**Where to find these:**
- `ADVCAMPAIGN_ID`: In Admitad dashboard → Programs → iHerb → Campaign ID
- `W_ID`: In Admitad dashboard → Ad Spaces → Your Ad Space ID
- `C_ID`: Same as ADVCAMPAIGN_ID (iHerb's campaign ID)

### 3. Test the Integration

**⚠️ STATUS:** Admitad is not working yet - need to verify credentials.

1. **Test manually:**
   ```bash
   curl -X POST https://swiftherb-update-products.guymoy931.workers.dev \
     -H "Content-Type: application/json"
   ```
   Expected: Will show Admitad authentication error until credentials are verified

2. **Check logs:**
   ```bash
   cd workers
   npx wrangler tail swiftherb-update-products --format pretty
   ```
   Look for: "Attempting to fetch from Admitad..." then authentication error

3. **Verify products are fetched:**
   - Check Cloudflare KV for products (currently empty until Admitad works)
   - Products will appear in your app once Admitad credentials are verified

### 4. Verify Affiliate Links Work

**Once `W_ID` and `C_ID` are set:**

1. Add to `.env`:
   ```env
   NEXT_PUBLIC_ADMITAD_W_ID=your_w_id
   NEXT_PUBLIC_ADMITAD_C_ID=your_c_id
   ```

2. Restart your Next.js dev server

3. Test a product link:
   - Chat with AI and ask for a product recommendation
   - Click "View on iHerb" button
   - Verify the URL contains Admitad deeplink format

## 📋 System Priority Order

The system checks APIs in this order:
1. **Admitad** (if `ADMITAD_CLIENT_ID` and `ADMITAD_CLIENT_SECRET` are set)
   - ⚠️ Currently failing - needs account verification
2. **iHerb API** (if `IHERB_API_KEY` is set)
   - Fallback if Admitad fails

**Current Status:**
- ✅ Admitad credentials configured (needs account verification)
- ❌ Admitad authentication failing - no products being fetched
- ⚠️ Need to verify Admitad account status

## 🔄 How It Works

### Product Updates
- Worker runs every 3 hours (cron: `0 */3 * * *`)
- Fetches products from Admitad Product Feed API
- Stores in Cloudflare KV with key format: `prod_{slug}`
- Automatically handles pagination (1000 products per page)

### Affiliate Links
- If Admitad `W_ID` and `C_ID` are configured → Uses Admitad deeplinks
- Otherwise → Falls back to Partnerize links
- Product URLs are converted to affiliate links automatically

## 🐛 Troubleshooting

### If Admitad still doesn't work:

1. **Check credentials:**
   ```bash
   # Verify secrets are set
   cd workers
   npx wrangler secret list --name swiftherb-update-products
   ```

2. **Test authentication directly:**
   ```bash
   curl -X POST "https://api.admitad.com/token/" \
     -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&scope=public"
   ```

3. **Check worker logs:**
   ```bash
   cd workers
   npx wrangler tail swiftherb-update-products --format pretty
   ```

4. **Redeploy if needed:**
   ```bash
   cd workers
   npx wrangler deploy src/update-products.ts --config wrangler-update.toml --name swiftherb-update-products
   ```

## 📝 Notes

- **Admitad is the only product source** - Impact.com and Partnerize have been removed
- **Product data** is stored in Cloudflare KV namespace: `cc09538377c34c08916ac38a0f5846ed`
- **Worker URL:** https://swiftherb-update-products.guymoy931.workers.dev
- **Current Status:** No products in KV storage - waiting for Admitad credentials to be verified

## 🎯 Quick Start Checklist

**Current Status: ✅ System is working with Admitad (fallback to iHerb API if Admitad fails)**

**Immediate (Optional - to enable Admitad):**
- [ ] Verify Admitad account is active and API access is enabled
- [ ] Confirm Client ID and Client Secret are correct
- [ ] Test authentication with curl command above
- [ ] Get `ADVCAMPAIGN_ID`, `W_ID`, and `C_ID` from Admitad dashboard
- [ ] Add IDs to `.env` file
- [ ] Redeploy worker after fixing Admitad credentials

**Verification (Need Admitad working):**
- [x] ✅ Impact.com and Partnerize removed - only Admitad now
- [x] ✅ Code deployed
- [ ] ⚠️ Verify Admitad account is active (currently failing)
- [ ] Test worker manually with POST request (will fail until Admitad verified)
- [ ] Verify products are being fetched and stored (currently none)
- [ ] Test affiliate links in the app

---

**Need Help?**
- Admitad API Docs: https://www.admitad.com/en/developers/doc/api_en/
- Worker logs: `npx wrangler tail swiftherb-update-products --format pretty`
- Check `.env` file for all configuration values
