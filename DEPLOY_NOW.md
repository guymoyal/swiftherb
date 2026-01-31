# Deploy SwiftHerb to Cloudflare Pages (Step-by-Step)

## ✅ Your Code is Already on GitHub
- Repository: `https://github.com/guymoyal/swiftherb`
- Remote is configured: `git@github.com:guymoyal/swiftherb.git`

## Step 1: Create New Cloudflare Pages Project Connected to Git

Since your existing project was created via direct upload, we'll create a new one connected to Git:

1. **Go to Cloudflare Dashboard**:
   - https://dash.cloudflare.com
   - Click **"Workers & Pages"** in the left sidebar

2. **Create New Project**:
   - Click **"Create application"** button (top right)
   - Select **"Pages"** tab
   - Click **"Connect to Git"** button

3. **Authorize GitHub**:
   - Select **"GitHub"** as your Git provider
   - Click **"Authorize Cloudflare"** or **"Continue with GitHub"**
   - You'll be redirected to GitHub to authorize
   - Click **"Authorize Cloudflare"** on GitHub
   - You may need to enter your GitHub password or use 2FA

4. **Select Your Repository**:
   - After authorization, you'll see a list of repositories
   - Find and select: **`guymoyal/swiftherb`**
   - Click **"Begin setup"**

## Step 2: Configure Build Settings

After selecting your repo, you'll see the build configuration page:

1. **Project name**: `swiftherb` (or `swiftherb-new` if you want to keep the old one)

2. **Production branch**: `main` (should be selected by default)

3. **Framework preset**: 
   - Select **"Next.js"** from the dropdown
   - Or leave as "None" and configure manually

4. **Build settings** (if not auto-detected):
   - **Build command**: `pnpm build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave empty)

5. **Environment variables** (click "Add variable" for each):
   ```
   DEEPSEEK_API_KEY = your_deepseek_api_key_here
   DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
   DEEPSEEK_MODEL = deepseek-chat
   NEXT_PUBLIC_PARTNERIZE_CAMREF = your_camref_here
   NEXT_PUBLIC_SITE_URL = https://swiftherb.com
   ```

6. **Node.js version**: Select **18** or higher

7. Click **"Save and Deploy"**

## Step 3: Connect Custom Domain

After the first deployment completes:

1. Go to your new project: **Workers & Pages** → **swiftherb** (or swiftherb-new)

2. Click **"Custom domains"** tab

3. Click **"Set up a custom domain"**

4. Enter: `swiftherb.com`

5. Cloudflare will automatically configure DNS records

6. Wait a few minutes for DNS to propagate

## Step 4: Verify Deployment

1. **Check Deployments**:
   - Go to **Deployments** tab
   - You should see a new deployment building
   - Wait 2-5 minutes for it to complete

2. **Test Your Site**:
   - Visit the deployment URL (e.g., `https://xxxxx.swiftherb.pages.dev`)
   - Or visit `https://swiftherb.com` after DNS propagates

## Step 5: Clean Up Old Project (Optional)

Once the new Git-connected project works:

1. Go to **Workers & Pages**
2. Find your old **swiftherb** project (the one without Git)
3. Click the **"..."** menu → **"Delete project"**
4. Confirm deletion

## Troubleshooting

### "Can't find Connect to Git button"
- Make sure you're clicking **"Create application"** → **"Pages"** → **"Connect to Git"**
- Don't look in the existing project settings

### "Repository not found"
- Make sure you authorized Cloudflare to access GitHub
- Check the repository name: `guymoyal/swiftherb`
- Verify the repo exists: https://github.com/guymoyal/swiftherb

### "Build failed"
- Check build logs in the **Deployments** tab
- Verify build command: `pnpm build`
- Check Node.js version is 18+

### "Environment variables not working"
- Make sure variables are set in **Production** environment
- Push a new commit after adding variables
- Variable names are case-sensitive

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

---

**Need help?** Check the build logs in Cloudflare Dashboard → Deployments → Click on a deployment → View logs
