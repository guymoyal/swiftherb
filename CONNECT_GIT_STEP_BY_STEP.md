# Connect Git to Cloudflare Pages - Exact Steps

## ⚠️ Important: You Must Create a NEW Project

Your existing `swiftherb` project was created via Direct Upload and **cannot** be converted to Git. You need to create a **new** project connected to Git.

## Step-by-Step Instructions

### Step 1: Navigate to Create New Project

1. **Go to**: https://dash.cloudflare.com
2. **Click**: "Workers & Pages" in the **left sidebar** (not the top menu)
3. **Look for**: A big button that says **"Create application"** or **"Create"** (usually top-right, blue/purple button)
4. **Click**: "Create application"

### Step 2: Select Pages

After clicking "Create application", you'll see options:
- **Workers** (for serverless functions)
- **Pages** (for static/full-stack sites) ← **Click this tab**
- **Queues** (for message queues)

**Click the "Pages" tab**

### Step 3: Connect to Git

On the Pages creation screen, you'll see two options:
- **"Connect to Git"** ← **Click this button**
- "Direct Upload" (ignore this)

**Click "Connect to Git"**

### Step 4: Authorize GitHub

1. You'll see Git providers: **GitHub**, GitLab, etc.
2. **Click "GitHub"**
3. You'll be redirected to GitHub
4. **Authorize Cloudflare** (you may need to enter your GitHub password)
5. You'll be redirected back to Cloudflare

### Step 5: Select Repository

1. You'll see a list of your GitHub repositories
2. **Search for**: `swiftherb` or scroll to find `guymoyal/swiftherb`
3. **Click** on `guymoyal/swiftherb`
4. **Click**: "Begin setup" or "Continue"

### Step 6: Configure Build Settings

Fill in these settings:

- **Project name**: `swiftherb-new` (or `swiftherb-git` - you can rename later)
- **Production branch**: `main` (should be auto-selected)
- **Framework preset**: Select **"Next.js"** from dropdown
- **Build command**: `pnpm build` (should auto-fill)
- **Build output directory**: `.next` (should auto-fill)
- **Root directory**: Leave empty (or `/`)
- **Node.js version**: Select **18** or **20**

### Step 7: Add Environment Variables

**Before clicking "Save and Deploy"**, click **"Add variable"** or go to Environment Variables section:

Add these variables (Production environment):
```
DEEPSEEK_API_KEY = [your key]
DEEPSEEK_API_URL = https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL = deepseek-chat
NEXT_PUBLIC_PARTNERIZE_CAMREF = [your camref]
NEXT_PUBLIC_SITE_URL = https://swiftherb.com
```

### Step 8: Save and Deploy

Click **"Save and Deploy"** or **"Deploy"**

The build will start automatically. Wait 2-5 minutes.

### Step 9: Connect Custom Domain

After deployment completes:

1. Go to your new project: **Workers & Pages** → `swiftherb-new`
2. Click **"Custom domains"** tab
3. Click **"Set up a custom domain"**
4. Enter: `swiftherb.com`
5. Cloudflare will configure DNS automatically

### Step 10: Delete Old Project (After New One Works)

Once `swiftherb-new` is working:

1. Go to **Workers & Pages**
2. Find old **`swiftherb`** project
3. Click **"..."** menu → **"Delete project"**

## If You Still Can't Find "Connect to Git"

### Option A: Check Your Account Type
- Make sure you're on a Cloudflare account (not just DNS)
- Free accounts support Git integration

### Option B: Try Direct URL
Go directly to: https://dash.cloudflare.com/[YOUR_ACCOUNT_ID]/pages/new/create

### Option C: Use Cloudflare API (Advanced)
I can help you create a script to do this via API if needed.

## Verify It Worked

After setup, check:
- **Deployments** tab shows your Git commits
- **Settings** → **Builds & deployments** shows "Git Provider: GitHub"
- Pushing to GitHub triggers automatic deployments

---

**Need help?** Tell me exactly what you see when you click "Create application" and I'll guide you further!
