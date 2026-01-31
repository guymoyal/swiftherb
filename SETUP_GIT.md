# Setup Git Remote for Cloudflare Deployment

## Current Status

You don't have a Git remote configured yet. Let's set it up so Cloudflare can automatically deploy when you push code.

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `swiftherb`
3. **Visibility**: Private or Public (your choice)
4. **DO NOT** initialize with README, .gitignore, or license (we already have code)
5. **Click "Create repository"**

## Step 2: Connect Local Repo to GitHub

After creating the repo, GitHub will show you commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/swiftherb.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/swiftherb.git

# Push your code
git push -u origin main
```

## Step 3: Connect GitHub to Cloudflare Pages

1. **Go to Cloudflare Dashboard**:
   - https://dash.cloudflare.com
   - Workers & Pages → **swiftherb** project

2. **Go to Settings**:
   - Click **Settings** tab
   - Scroll to **Builds & deployments**

3. **Connect to Git**:
   - Click **"Connect to Git"** button
   - Authorize Cloudflare to access GitHub
   - Select your repository: `YOUR_USERNAME/swiftherb`
   - Click **"Begin setup"**

4. **Configure Build Settings**:
   - **Framework preset**: Next.js (should auto-detect)
   - **Build command**: `pnpm build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave empty)
   - **Node.js version**: 18 or higher
   - Click **"Save and Deploy"**

## Step 4: Verify It Works

1. **Check Deployment**:
   - Go to **Deployments** tab
   - You should see a new deployment starting
   - Wait for it to complete (2-5 minutes)

2. **Test Your Site**:
   - Visit the deployment URL
   - Or wait for it to become production
   - Your custom domain (`swiftherb.com`) will update automatically

## Future Deployments

Now whenever you push code:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Cloudflare will automatically:
- ✅ Detect the push
- ✅ Build your Next.js app
- ✅ Deploy to production
- ✅ Update your custom domain

## Troubleshooting

### "Permission denied" when pushing
- Make sure you're authenticated with GitHub
- Try: `gh auth login` (if you have GitHub CLI)
- Or use SSH instead of HTTPS

### "Repository not found"
- Check the repository name is correct
- Make sure the repository exists on GitHub
- Verify your GitHub username is correct

### Cloudflare can't find the repo
- Make sure you authorized Cloudflare to access GitHub
- Check the repository is visible to Cloudflare
- Try disconnecting and reconnecting

---

**Once set up, deployments are automatic!** 🚀
