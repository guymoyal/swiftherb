# Unsplash Image Setup - Quick Guide

**Get FREE images for your articles and products!**

---

## Step 1: Get Your FREE Unsplash API Key (2 minutes)

1. **Go to:** https://unsplash.com/developers
2. **Click:** "Register as a developer" (or sign in if you have an account)
3. **Create Application:**
   - Click "New Application"
   - Fill in:
     - **Application name:** SwiftHerb
     - **Description:** AI-powered supplement recommendation platform
     - **Website URL:** https://swiftherb.pages.dev
   - Accept terms
   - Click "Create application"
4. **Copy Your Access Key:**
   - You'll see your "Access Key" (starts with something like `abc123...`)
   - Copy it!

---

## Step 2: Add to `.env` File

Open your `.env` file and add:

```env
UNSPLASH_ACCESS_KEY=your_access_key_here
```

Replace `your_access_key_here` with the key you copied from Unsplash.

---

## Step 3: Use It!

### For Products (Automatic):
Products will automatically use Unsplash images when you have the API key set.

### For Articles (Run Script):
Run the script to update article images:

```bash
npm run update-article-images
```

---

## That's It! 🎉

Once you add the API key, images will be fetched automatically from Unsplash.

**Rate Limits:** Free tier allows 50 requests/hour (plenty for development!)

---

## Need Help?

- **Unsplash API Docs:** https://unsplash.com/documentation
- **Check if key works:** The script will tell you if the key is invalid
