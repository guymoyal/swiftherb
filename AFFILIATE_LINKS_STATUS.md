# Affiliate Links Status Check

**Last Updated:** February 22, 2026

## Current Status: ❌ NOT CONNECTED TO YOUR ACCOUNT

### What's Happening Now

**Your links are currently:**
- ✅ Working (users can click and go to iHerb)
- ❌ **NOT tracking commissions** (no affiliate tracking)
- ❌ **NOT connected to any affiliate account**

**Current Link Format:**
```
https://www.iherb.com/search?kw=ProductName
```
This is a **direct iHerb link** with no affiliate tracking.

---

## Why Links Aren't Connected

### 1. Admitad Not Configured
**Missing IDs:**
- ❌ `NEXT_PUBLIC_ADMITAD_W_ID` - Not set (commented out in `.env`)
- ❌ `NEXT_PUBLIC_ADMITAD_C_ID` - Not set (commented out in `.env`)

**Current `.env` status:**
```env
# NEXT_PUBLIC_ADMITAD_W_ID=your_ad_space_id  # ← Commented out
# NEXT_PUBLIC_ADMITAD_C_ID=your_campaign_id   # ← Commented out
```

**What this means:** Admitad deeplinks won't work until these are set.


---

## How to Check if Links Are Connected

### Test Current Links

1. **Open your website** and click a "View on iHerb" button
2. **Check the URL** in your browser's address bar

**If you see:**
- `https://www.iherb.com/search?kw=...` 
  - ❌ **NOT connected** - Direct link, no tracking
  
**If you see:**
- `https://api.admitad.com/deeplink/...`
  - ✅ **Admitad connected** - Commission tracking active

---

## How to Connect Links

### Option 1: Connect Admitad (Recommended)

**Step 1:** Get your Admitad IDs from dashboard:
- `W_ID` (Ad Space ID)
- `C_ID` (Campaign ID for iHerb)

**Step 2:** Add to `.env`:
```env
NEXT_PUBLIC_ADMITAD_W_ID=your_real_w_id_here
NEXT_PUBLIC_ADMITAD_C_ID=your_real_c_id_here
```

**Step 3:** Restart your dev server:
```bash
npm run dev
```

**Step 4:** Test a link - should now show Admitad deeplink format

---

## Priority Order

The system checks in this order:
1. **Admitad** (if `W_ID` and `C_ID` are set) ← **Use this**
2. **Direct iHerb** (fallback - no tracking) ← **Currently using this**

---

## Quick Test

**Run this in your browser console on your site:**
```javascript
// Check what affiliate system is active
console.log('Admitad W_ID:', process.env.NEXT_PUBLIC_ADMITAD_W_ID || 'NOT SET');
console.log('Admitad C_ID:', process.env.NEXT_PUBLIC_ADMITAD_C_ID || 'NOT SET');
```

**Or check the actual link:**
1. Click any "View on iHerb" button
2. Look at the URL - if it's just `iherb.com/search?kw=...` → **NOT connected**

---

## Summary

| Status | Admitad | Current |
|--------|---------|---------|
| **Configured?** | ❌ No | ✅ Yes |
| **Tracking?** | ❌ No | ❌ No |
| **Links Work?** | N/A | ✅ Yes (but no commissions) |

**Action Needed:** Add Admitad IDs (`NEXT_PUBLIC_ADMITAD_W_ID` and `NEXT_PUBLIC_ADMITAD_C_ID`) to start earning commissions.
