# Push Code to GitHub - Step by Step

## The Problem

Your repository exists at https://github.com/guymoyal/swiftherb but it's **empty** because the push failed due to authentication.

## Solution: Use Personal Access Token

### Step 1: Create Token

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Name**: `swiftherb-push`
4. **Expiration**: Choose (90 days, 1 year, or no expiration)
5. **Select scopes**: Check **`repo`** ✅
6. Click **"Generate token"**
7. **COPY THE TOKEN** (starts with `ghp_...`) - you won't see it again!

### Step 2: Push with Token

Run this command:

```bash
git push -u origin main
```

**When prompted:**
- **Username**: `guymoyal`
- **Password**: **Paste your token** (not your GitHub password!)

### Step 3: Verify

After successful push, visit:
- https://github.com/guymoyal/swiftherb
- You should see all your files!

## Alternative: Use Token in URL (One-time)

If the prompt doesn't work, you can embed the token temporarily:

```bash
# Replace YOUR_TOKEN with your actual token
git remote set-url origin https://YOUR_TOKEN@github.com/guymoyal/swiftherb.git
git push -u origin main

# After successful push, change back (for security)
git remote set-url origin https://github.com/guymoyal/swiftherb.git
```

## After Push Succeeds

Once code is on GitHub, we'll connect it to Cloudflare Pages for automatic deployments!

---

**Ready?** Create your token, then run `git push -u origin main` and enter your token when prompted.
