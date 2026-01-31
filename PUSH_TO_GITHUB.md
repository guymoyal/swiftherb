# Push Code to GitHub - Authentication Required

## Current Status

✅ Remote added: `origin` → `https://github.com/guymoyal/swiftherb.git`
❌ Push failed: Authentication required

## Solution: Authenticate with GitHub

You have 3 options:

### Option 1: Use GitHub CLI (Easiest)

```bash
# Install GitHub CLI if not installed
brew install gh

# Authenticate
gh auth login

# Follow prompts:
# - Choose GitHub.com
# - Choose HTTPS
# - Authenticate via browser
# - Grant permissions

# Then push
git push -u origin main
```

### Option 2: Use Personal Access Token

1. **Create Token**:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name: `swiftherb-push`
   - Select scopes: `repo` (full control)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push with Token**:
   ```bash
   git push -u origin main
   # Username: guymoyal
   # Password: [paste your token here]
   ```

### Option 3: Use SSH (Most Secure)

1. **Generate SSH Key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Enter passphrase (optional)
   ```

2. **Add SSH Key to GitHub**:
   ```bash
   # Copy your public key
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```

3. **Add to GitHub**:
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key
   - Click "Add SSH key"

4. **Change Remote to SSH**:
   ```bash
   git remote set-url origin git@github.com:guymoyal/swiftherb.git
   git push -u origin main
   ```

## After Successful Push

Once code is pushed, connect to Cloudflare:

1. **Go to Cloudflare Dashboard**:
   - Workers & Pages → swiftherb → Settings

2. **Connect to Git**:
   - Click "Connect to Git" or "Change source"
   - Authorize Cloudflare → GitHub
   - Select `guymoyal/swiftherb`
   - Configure build settings

3. **Build Settings**:
   - Framework: Next.js
   - Build command: `pnpm build`
   - Output directory: `.next`
   - Node.js: 18

4. **Add Environment Variables** (if not already set)

5. **Deploy!** Cloudflare will build automatically

---

**Which method do you prefer?** I recommend Option 1 (GitHub CLI) as it's the easiest.
