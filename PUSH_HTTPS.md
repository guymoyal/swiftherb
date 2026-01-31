# Push to GitHub via HTTPS

## Current Status

✅ Remote configured: `origin` → `https://github.com/guymoyal/swiftherb.git`
❌ Need authentication to push

## Solution: Use Personal Access Token

GitHub no longer accepts passwords. You need a **Personal Access Token**.

### Step 1: Create Personal Access Token

1. **Go to GitHub Settings**:
   - https://github.com/settings/tokens
   - Or: GitHub → Your Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**:
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - **Note**: `swiftherb-push` (or any name you want)
   - **Expiration**: Choose your preference (90 days, 1 year, or no expiration)
   - **Select scopes**: Check **`repo`** (this gives full repository access)
   - Scroll down and click **"Generate token"**

3. **Copy the Token**:
   - ⚠️ **IMPORTANT**: Copy it NOW - you won't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Push Using Token

**Option A: Push and Enter Credentials**

```bash
git push -u origin main
```

When prompted:
- **Username**: `guymoyal`
- **Password**: Paste your token (not your GitHub password!)

**Option B: Store Credentials (Easier for Future)**

```bash
# Configure git to store credentials
git config --global credential.helper osxkeychain

# Then push (will prompt once, then remember)
git push -u origin main
# Username: guymoyal
# Password: [paste token]
```

**Option C: Use Token in URL (One-time)**

```bash
# Replace YOUR_TOKEN with your actual token
git remote set-url origin https://YOUR_TOKEN@github.com/guymoyal/swiftherb.git
git push -u origin main

# Then change back to normal URL (for security)
git remote set-url origin https://github.com/guymoyal/swiftherb.git
```

### Step 3: Verify Push

After successful push:

```bash
# Check remote status
git remote -v

# Verify code is on GitHub
# Visit: https://github.com/guymoyal/swiftherb
```

## Troubleshooting

### "Authentication failed"
- Make sure you're using the **token**, not your password
- Check token hasn't expired
- Verify token has `repo` scope

### "Permission denied"
- Token might not have correct permissions
- Create new token with `repo` scope

### "Repository not found"
- Check repository name: `guymoyal/swiftherb`
- Verify repository exists on GitHub
- Make sure you have access

## After Successful Push

Once code is pushed, we'll connect it to Cloudflare Pages for automatic deployments!

---

**Ready?** Create your token at https://github.com/settings/tokens, then run:
```bash
git push -u origin main
```
