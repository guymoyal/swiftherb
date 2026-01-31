# Complete Setup: Git + Cloudflare Deployment

## Current Situation

- ✅ Your site works at `swiftherb.com` (deployment 488156f8)
- ❌ Cloudflare project shows "Git Provider: No"
- ❌ No Git remote configured locally
- ❌ Can't deploy new code automatically

## Solution: Set Up Git Connection

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `swiftherb`
3. **DO NOT** check any boxes (no README, no .gitignore, no license)
4. Click "Create repository"

### Step 2: Push Your Code to GitHub

After creating the repo, run these commands:

```bash
# Add GitHub as remote
git remote add origin https://github.com/guymoyal/swiftherb.git

# Push your code
git push -u origin main
```

**If you get authentication errors**, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys
- Or use GitHub CLI: `gh auth login`

### Step 3: Connect Git in Cloudflare

**Option A: Connect to Existing Project** (if possible)

1. Go to Cloudflare Dashboard:
   - https://dash.cloudflare.com
   - Workers & Pages → **swiftherb** → **Settings**

2. Look for "Source" or "Builds & deployments" section

3. If you see "Connect to Git" or "Change source":
   - Click it
   - Authorize Cloudflare → GitHub
   - Select `guymoyal/swiftherb`
   - Configure build settings (see below)

**Option B: Create New Project** (if Option A doesn't work)

1. Workers & Pages → **Create application** → **Pages** → **Connect to Git**
2. Select **GitHub** and authorize
3. Select repository: `guymoyal/swiftherb`
4. Click **"Begin setup"**

5. **Configure Build Settings**:
   - Project name: `swiftherb` (or `swiftherb-new`)
   - Framework preset: **Next.js**
   - Build command: `pnpm build`
   - Build output directory: `.next`
   - Root directory: `/` (leave empty)
   - Node.js version: **18** or higher

6. Click **"Save and Deploy"**

7. **Add Environment Variables**:
   - Settings → Environment Variables
   - Add: `DEEPSEEK_API_KEY`, `DEEPSEEK_API_URL`, `DEEPSEEK_MODEL`, etc.

8. **Connect Custom Domain**:
   - Custom domains → Add `swiftherb.com`
   - Cloudflare will configure DNS

9. **Delete Old Project** (once new one works):
   - Old project → Settings → Delete project

### Step 4: Verify It Works

1. **Check Deployment**:
   - Deployments tab → Should see new deployment building
   - Wait 2-5 minutes for completion

2. **Test Site**:
   - Visit `swiftherb.com` (should work automatically)

## Future Deployments

Now you can deploy by simply pushing:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Cloudflare will automatically build and deploy! 🚀

## Troubleshooting

### "Permission denied" when pushing
- GitHub no longer accepts passwords
- Use Personal Access Token or SSH
- Or use GitHub CLI: `gh auth login`

### "Repository not found"
- Make sure repo exists on GitHub
- Check repository name matches
- Verify you have access

### Can't find "Connect to Git" in Cloudflare
- Project might be in "Direct Upload" mode
- Use Option B: Create new project connected to Git
- Then transfer custom domain

---

**Ready?** Start with Step 1 (create GitHub repo), then tell me when it's done!
