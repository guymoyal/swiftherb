# How to Apply to iHerb Program on Admitad

## Current Situation

✅ **Your Client ID is correct** - `lX1AfZ0aYk4xAvdmxEu4bwVpn8ALLj`  
⚠️ **Authentication failing** - Need to verify API application status  
⚠️ **iHerb program not found** - Need to apply to iHerb's affiliate program  

## Step 1: Fix Authentication First

### Check Your Admitad Dashboard

1. **Log into Admitad**: https://www.admitad.com
2. **Go to API/Developers Section**:
   - Look for "API" or "Developers" in the menu
   - Or go to: https://www.admitad.com/en/webmaster/account/settings/api/
3. **Verify Your API Application**:
   - Check if your application is **Active**
   - Verify the Client ID matches: `lX1AfZ0aYk4xAvdmxEu4bwVpn8ALLj`
   - Make sure API access is **enabled**

### If Client ID Doesn't Match

1. Copy the **correct Client ID** from Admitad dashboard
2. Update your `.env` file
3. Update Cloudflare secrets:
   ```bash
   cd workers
   echo "YOUR_CORRECT_CLIENT_ID" | npx wrangler secret put ADMITAD_CLIENT_ID --config wrangler-update.toml --name swiftherb-update-products
   ```

## Step 2: Find and Apply to iHerb Program

### Direct Link to iHerb Program
**iHerb.com INT Affiliate Program**: https://www.admitad.com/us/store/offers/iherb-ww/

### Steps to Apply

1. **Log into Admitad Dashboard**
2. **Go to "Stores" or "Programs" Section**
   - Look for "All Programs" or "Store Catalog"
   - Or search for "iHerb"
3. **Search for iHerb**:
   - Search bar: Type "iHerb" or "iHerb.com"
   - Look for "iHerb.com INT" or "iHerb WW"
4. **Click on iHerb Program**
5. **Click "Apply" or "Join Program"**
6. **Review Terms**:
   - Read the program terms
   - Check commission rates
   - Note cookie lifetime (7 days)
7. **Submit Application**
8. **Wait for Approval**:
   - Approval rate: ~90.9%
   - Average approval time: Can take a few days to weeks

### Alternative: Search in Admitad

1. **Dashboard → Stores/Programs**
2. **Search**: "iHerb" or "health" or "supplements"
3. **Filter**: Look for health/wellness category
4. **Find**: "iHerb.com INT" program

## Step 3: Get Required IDs After Approval

Once approved, you'll need these IDs:

### 1. Campaign ID (ADVCAMPAIGN_ID)
- **Where**: Admitad Dashboard → Programs → iHerb → Campaign Details
- **What**: The ID for iHerb's campaign in Admitad
- **Used for**: Filtering products to only iHerb products

### 2. Ad Space ID (W_ID)
- **Where**: Admitad Dashboard → Ad Spaces → Your Ad Space
- **What**: Your unique Ad Space identifier
- **Used for**: Generating deeplinks

### 3. Campaign ID for Deeplinks (C_ID)
- **Where**: Same as ADVCAMPAIGN_ID usually
- **What**: iHerb's campaign ID (for deeplink generation)
- **Used for**: Creating affiliate links

### Add to `.env`:
```env
ADMITAD_ADVCAMPAIGN_ID=your_iherb_campaign_id
NEXT_PUBLIC_ADMITAD_W_ID=your_ad_space_id
NEXT_PUBLIC_ADMITAD_C_ID=your_campaign_id
```

## Step 4: Test After Approval

Once you have iHerb program access:

1. **Update `.env` with IDs** (from Step 3)
2. **Test authentication**:
   ```bash
   curl -X POST "https://api.admitad.com/token/" \
     -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&scope=public"
   ```
3. **Test product fetching**:
   ```bash
   curl -X POST https://swiftherb-update-products.guymoy931.workers.dev \
     -H "Content-Type: application/json"
   ```

## Current Workaround

**Until iHerb program is approved:**
- ✅ Homepage shows best sellers (using mock products)
- ✅ Affiliate links work (using Partnerize fallback)
- ✅ System is functional
- ⏳ Will automatically switch to Admitad when ready

## Program Details

- **Commission**: Varies (check program page)
- **Cookie Lifetime**: 7 days
- **Approval Rate**: ~90.9%
- **Payment**: Usually monthly
- **Global**: Available in 40+ countries

## Need Help?

- **Admitad Support**: Contact through your dashboard
- **iHerb Affiliate Info**: https://www.iherb.com/info/affiliates
- **Admitad API Docs**: https://www.admitad.com/en/developers/doc/api_en/

---

**Note**: The code is ready - it will automatically start fetching iHerb products once:
1. Authentication works (Client ID verified)
2. iHerb program is approved
3. Campaign IDs are configured
