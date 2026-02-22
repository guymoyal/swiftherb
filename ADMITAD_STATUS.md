# Admitad Integration Status

**Last Updated:** February 22, 2026

## ⚠️ Current Status: Two Issues

### Issue 1: Authentication Failing
**Error Message**: `"client_id None doesn't exist"`

**What This Means**:
- Your Client ID `lX1AfZ0aYk4xAvdmxEu4bwVpn8ALLj` is correctly formatted
- The base64 encoding is correct
- Cloudflare secrets are set correctly
- **BUT**: Admitad doesn't recognize this Client ID in their system

**Possible Reasons**:
1. **API Application Not Activated**: The Client ID exists but the application isn't approved/activated
2. **API Access Not Enabled**: API access might not be enabled for your account
3. **Account Status**: Your Admitad account may need verification

### Issue 2: iHerb Program Not Found
**Status**: You can't find iHerb program in your Admitad account

**What This Means**:
- You need to **apply to iHerb's affiliate program** in Admitad
- Even if authentication works, you won't get iHerb products without program access
- See `ADMITAD_IHERB_GUIDE.md` for step-by-step instructions

**Direct Link**: https://www.admitad.com/us/store/offers/iherb-ww/

## ✅ What's Working

### Code Implementation
- ✅ Admitad OAuth2 authentication code
- ✅ Product feed fetching code
- ✅ Deeplink generation code (`lib/admitad.ts`)
- ✅ Unified affiliate link system (`lib/affiliate.ts`)
- ✅ All code deployed to Cloudflare Workers

### Configuration
- ✅ Secrets set in Cloudflare:
  - `ADMITAD_CLIENT_ID`
  - `ADMITAD_CLIENT_SECRET`
  - `ADMITAD_BASE64_HEADER`

## 🔧 Next Steps to Fix

### 1. Verify Client ID in Admitad Dashboard
1. Log into https://www.admitad.com
2. Go to **API/Developers** section (or **Applications**)
3. Find your API application
4. **Verify the Client ID matches**: `lX1AfZ0aYk4xAvdmxEu4bwVpn8ALLj`
5. Check if the application status is **Active/Approved**

### 2. If Client ID Doesn't Match
Update your `.env` and Cloudflare secrets:
```bash
# Update .env file with correct Client ID
# Then update Cloudflare secrets:
cd workers
echo "YOUR_CORRECT_CLIENT_ID" | npx wrangler secret put ADMITAD_CLIENT_ID --config wrangler-update.toml --name swiftherb-update-products
echo "YOUR_CORRECT_CLIENT_SECRET" | npx wrangler secret put ADMITAD_CLIENT_SECRET --config wrangler-update.toml --name swiftherb-update-products

# Generate new base64 header
node -e "console.log(Buffer.from('CLIENT_ID:CLIENT_SECRET').toString('base64'))"
echo "NEW_BASE64_HEADER" | npx wrangler secret put ADMITAD_BASE64_HEADER --config wrangler-update.toml --name swiftherb-update-products

# Redeploy
npx wrangler deploy src/update-products.ts --config wrangler-update.toml --name swiftherb-update-products
```

### 3. If Client ID Matches But Still Fails
- Check if API application needs approval (contact Admitad support)
- Verify API access is enabled for your account
- Check if there are any account restrictions

### 4. Test After Fixing
```bash
# Test the worker
curl -X POST https://swiftherb-update-products.guymoy931.workers.dev \
  -H "Content-Type: application/json"

# Check logs
cd workers
npx wrangler tail swiftherb-update-products --format pretty
```

## 📋 Additional IDs Needed (When Admitad Works)

Once authentication works, you'll need these IDs for full functionality:

1. **ADMITAD_ADVCAMPAIGN_ID** - iHerb's campaign ID (for filtering products)
   - Find in: Admitad Dashboard → Programs → iHerb → Campaign ID

2. **NEXT_PUBLIC_ADMITAD_W_ID** - Your Ad Space ID (for deeplinks)
   - Find in: Admitad Dashboard → Ad Spaces → Your Ad Space ID

3. **NEXT_PUBLIC_ADMITAD_C_ID** - iHerb's Campaign ID (for deeplinks)
   - Same as ADVCAMPAIGN_ID usually

Add to `.env`:
```env
ADMITAD_ADVCAMPAIGN_ID=your_campaign_id
NEXT_PUBLIC_ADMITAD_W_ID=your_ad_space_id
NEXT_PUBLIC_ADMITAD_C_ID=your_campaign_id
```

## 🔗 Affiliate Links Status

**Current**: Using Partnerize links (fallback)
- Product cards will use Partnerize links until Admitad deeplink IDs are set
- Once `W_ID` and `C_ID` are configured, links will automatically switch to Admitad

**Code Location**: `lib/affiliate.ts` handles the switching automatically

## 📝 Notes

- All code is ready and deployed
- System will automatically start fetching products once Admitad credentials are verified
- Products will be stored in Cloudflare KV: `cc09538377c34c08916ac38a0f5846ed`
- Worker runs every 3 hours automatically

---

**Need Help?**
- Admitad API Docs: https://www.admitad.com/en/developers/doc/api_en/
- Worker URL: https://swiftherb-update-products.guymoy931.workers.dev
