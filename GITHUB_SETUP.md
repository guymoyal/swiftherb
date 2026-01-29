# GitHub Repository Setup for SwiftHerb

## Git Configuration ✅

Your git is configured:
- **Username:** guymoyal
- **Email:** guymoy931@gmail.com

## Step 1: Create GitHub Repository

1. **Go to GitHub**:
   - Visit https://github.com/new
   - Or go to https://github.com and click the "+" icon → "New repository"

2. **Repository Settings**:
   ```
   Repository name: swiftherb
   Description: AI-powered supplement recommendation platform
   Visibility: Public (or Private - your choice)
   ⚠️ DO NOT initialize with README, .gitignore, or license
   (We already have these files)
   ```

3. **Click "Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/guymoyal/swiftherb.git

# Verify it was added
git remote -v

# Push your code
git push -u origin main
```

## Step 3: Verify Push

After pushing, you should see:
- All your files on GitHub
- Repository URL: https://github.com/guymoyal/swiftherb

## Step 4: Deploy to Cloudflare Pages

Once your code is on GitHub:

1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select **GitHub**
4. Authorize Cloudflare (if needed)
5. Select repository: **guymoyal/swiftherb**
6. Click **Begin setup**

Then follow the steps in `DEPLOY_NOW.md`

## Quick Commands Reference

```bash
# Check git status
git status

# Check remote repositories
git remote -v

# Add remote (if not already added)
git remote add origin https://github.com/guymoyal/swiftherb.git

# Push to GitHub
git push -u origin main

# Future updates
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

### "Repository not found"
- Make sure you created the repository on GitHub first
- Check the repository name matches: `swiftherb`
- Verify your GitHub username is correct: `guymoyal`

### "Permission denied"
- You may need to authenticate with GitHub
- Use GitHub CLI: `gh auth login`
- Or use SSH instead of HTTPS

### "Remote already exists"
```bash
# Remove existing remote
git remote remove origin

# Add it again
git remote add origin https://github.com/guymoyal/swiftherb.git
```

---

**Ready? Create the GitHub repository first, then run the commands above!** 🚀
