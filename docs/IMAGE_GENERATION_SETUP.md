# Image Generation Setup Guide

**Last Updated:** February 15, 2026

## Current Situation

- **Current:** Products use placeholder images (`via.placeholder.com`)
- **Future:** Admitad will provide real product images when approved
- **DeepSeek API:** Does NOT support image generation (text-only model)

---

## 🎯 Recommended Solution: Unsplash API (FREE)

**Why Unsplash?**
- ✅ **100% FREE** - No credit card required
- ✅ **Real photos** - High-quality product/supplement photos
- ✅ **Fast** - No generation time, instant results
- ✅ **Perfect for products** - Thousands of supplement/product photos
- ✅ **Commercial use allowed** - Free for commercial projects

### Setup Steps

1. **Get Free API Key:**
   - Go to: https://unsplash.com/developers
   - Sign up (free account)
   - Create a new application
   - Copy your Access Key

2. **Add to `.env`:**
   ```env
   UNSPLASH_ACCESS_KEY=your_access_key_here
   ```

3. **Usage:**
   ```typescript
   import { generateImageWithUnsplash } from "@/lib/image-generation";
   
   const imageUrl = await generateImageWithUnsplash("Vitamin D3");
   // Returns: https://images.unsplash.com/photo-...
   ```

---

## 🔄 Alternative Options

### Option 2: Stability AI (Stable Diffusion) - FREE Tier

**Pros:**
- ✅ Free tier available (25 credits/month)
- ✅ Generate custom images
- ✅ Good quality

**Cons:**
- ⚠️ Limited free credits
- ⚠️ Takes time to generate (5-10 seconds)
- ⚠️ Generated images may not look like real products

**Setup:**
1. Sign up: https://platform.stability.ai
2. Get API key
3. Add to `.env`:
   ```env
   STABILITY_API_KEY=your_key_here
   ```

### Option 3: OpenAI DALL-E - PAID

**Pros:**
- ✅ Highest quality
- ✅ Best prompt understanding
- ✅ Professional results

**Cons:**
- ❌ Costs money ($0.04 per image)
- ❌ Slower generation

**Setup:**
1. Get OpenAI API key
2. Add to `.env`:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

---

## 💡 Best Strategy

### For Now (Development):
1. **Use Unsplash API** - Free, fast, real photos
2. Add `UNSPLASH_ACCESS_KEY` to `.env`
3. Update products to use `generateImageWithUnsplash()`

### Later (Production):
1. **Wait for Admitad** - They provide real product images
2. Use Admitad images as primary source
3. Fallback to Unsplash if image missing

---

## 📝 Implementation Example

### Update Product Fetching

```typescript
// In workers/src/update-products.ts or lib/products.ts
import { generateImageWithUnsplash } from "@/lib/image-generation";

// When fetching/creating products:
const productImage = await generateImageWithUnsplash(product.title);
product.image = productImage || fallbackPlaceholder;
```

### Batch Update Existing Products

```typescript
// One-time script to update all mock products
import { generateProductImages } from "@/lib/image-generation";

const products = Object.values(MOCK_PRODUCTS);
const images = await generateProductImages(
  products.map(p => ({ name: p.title, id: p.id }))
);

// Update products with new images
products.forEach(product => {
  if (images[product.id]) {
    product.image = images[product.id];
  }
});
```

---

## 🚀 Quick Start

1. **Get Unsplash API Key** (2 minutes):
   - Visit: https://unsplash.com/developers
   - Click "Register as a developer"
   - Create new application
   - Copy Access Key

2. **Add to `.env`:**
   ```env
   UNSPLASH_ACCESS_KEY=your_key_here
   ```

3. **Test it:**
   ```typescript
   const image = await generateImageWithUnsplash("Magnesium Glycinate");
   console.log(image); // Should return Unsplash URL
   ```

4. **Update products:**
   - Use `generateImageWithUnsplash()` when creating products
   - Or run batch update script once

---

## 📊 Cost Comparison

| Service | Cost | Quality | Speed | Best For |
|---------|------|---------|-------|----------|
| **Unsplash** | FREE | ⭐⭐⭐⭐ | Instant | Product photos |
| **Stable Diffusion** | Free tier | ⭐⭐⭐ | 5-10s | Custom images |
| **DALL-E** | $0.04/img | ⭐⭐⭐⭐⭐ | 10-20s | Premium quality |
| **Admitad** | FREE | ⭐⭐⭐⭐⭐ | Instant | Real product images |

---

## ⚠️ Important Notes

1. **DeepSeek API cannot generate images** - It's a text model only
2. **Unsplash is the best free option** - Real photos, instant, free
3. **Admitad will provide images** - When your account is approved
4. **Rate limits** - Unsplash: 50 requests/hour (free), Stability: 25/month (free)

---

## 🔗 Useful Links

- **Unsplash API Docs:** https://unsplash.com/documentation
- **Stability AI:** https://platform.stability.ai
- **OpenAI DALL-E:** https://platform.openai.com/docs/guides/images
- **Image Generation Code:** `lib/image-generation.ts`
