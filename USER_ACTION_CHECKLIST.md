# User Action Checklist - Things You Need to Do

This file contains all the tasks that require **your action** (signups, API keys, configurations, etc.)

## 🔑 API Keys & Accounts (Required for Production)

### 1. DeepSeek API Key (REQUIRED - For AI responses)
- [ ] **Sign up**: Go to https://platform.deepseek.com
- [ ] **Create API key**: Dashboard → API Keys → Create new key
- [ ] **Add to `.env`**: `DEEPSEEK_API_KEY=sk-your-key-here`
- [ ] **Cost**: ~$0.00035 per conversation (very cheap!)
- [ ] **Free tier**: Available for testing

**Status**: ⏳ Waiting for your API key

---

### 2. Partnerize Account (REQUIRED - For affiliate commissions)
- [ ] **Sign up**: Go to https://www.partnerize.com
- [ ] **Apply for iHerb partnership**: Request access to iHerb program
- [ ] **Get CAMREF ID**: After approval, find your CAMREF in dashboard
- [ ] **Add to `.env`**: `NEXT_PUBLIC_PARTNERIZE_CAMREF=your_camref_here`
- [ ] **Note**: Approval may take a few days

**Status**: ⏳ Waiting for Partnerize account approval

---

### 3. Cloudflare Account (OPTIONAL - For KV storage later)
- [ ] **Sign up**: Go to https://dash.cloudflare.com/sign-up
- [ ] **Create KV namespace**: Workers & Pages → KV → Create namespace
- [ ] **Get namespace ID**: Copy the namespace ID
- [ ] **Create API token**: My Profile → API Tokens → Create token
- [ ] **Add to `.env`**:
  ```
  CF_ACCOUNT_ID=your_account_id
  CF_KV_NAMESPACE_ID=your_kv_namespace_id
  CF_API_TOKEN=your_api_token
  ```

**Status**: ⏳ Optional - Only needed when migrating from mock data

---

## 🌐 Domain & Hosting (For Production)

### 4. Domain Name (OPTIONAL)
- [ ] **Purchase domain**: swiftherb.com (or your preferred name)
- [ ] **DNS setup**: Point to your hosting provider
- [ ] **Update `.env`**: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`

**Status**: ⏳ Optional - Can use free hosting subdomain initially

---

### 5. Hosting Provider (Choose one)
- [ ] **Vercel** (Recommended for Next.js):
  - Sign up: https://vercel.com
  - Connect GitHub repo
  - Add environment variables in dashboard
  - Deploy automatically
  
- [ ] **Cloudflare Pages** (Alternative):
  - Sign up: https://dash.cloudflare.com
  - Connect GitHub repo
  - Add environment variables
  - Deploy

**Status**: ⏳ Choose and set up hosting

---

## 📊 Analytics & Monitoring (Optional but Recommended)

### 6. Error Tracking (Optional)
- [ ] **Sentry** (Recommended):
  - Sign up: https://sentry.io
  - Create project
  - Get DSN
  - Add to `.env`: `NEXT_PUBLIC_SENTRY_DSN=your_dsn`

**Status**: ⏳ Optional - Helps catch production errors

---

### 7. Analytics (Optional)
- [ ] **Google Analytics** or **Plausible**:
  - Set up account
  - Get tracking ID
  - Add to project (code ready, just needs ID)

**Status**: ⏳ Optional - Track user behavior

---

## 🧪 Testing Checklist (Do After Setup)

### After Getting API Keys:
- [ ] Test AI responses with various queries
- [ ] Verify product cards display correctly
- [ ] Test affiliate links (they should open iHerb)
- [ ] Test on mobile devices
- [ ] Check error handling (disconnect API key temporarily)

### Before Launch:
- [ ] Test all features end-to-end
- [ ] Verify all environment variables are set
- [ ] Check mobile responsiveness
- [ ] Test loading states
- [ ] Verify chat history persistence

---

## 📝 Quick Setup Guide

1. **Copy environment file**:
   ```bash
   cp env.example .env
   ```

2. **Add your API keys** to `.env`:
   ```env
   DEEPSEEK_API_KEY=sk-your-key-here
   NEXT_PUBLIC_PARTNERIZE_CAMREF=your_camref_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Test locally** before deploying

---

## 🚀 Deployment Steps (When Ready)

1. [ ] Get all API keys (DeepSeek, Partnerize)
2. [ ] Set up hosting (Vercel/Cloudflare Pages)
3. [ ] Add environment variables to hosting dashboard
4. [ ] Deploy and test production build
5. [ ] Set up custom domain (optional)
6. [ ] Monitor for errors
7. [ ] Launch! 🎉

---

## 💰 Cost Estimates

- **DeepSeek API**: ~$0.35 per 1,000 conversations
- **Hosting**: Free tier available (Vercel/Cloudflare)
- **Domain**: ~$10-15/year (optional)
- **Total Monthly**: ~$1-5 for low traffic

---

## ⚠️ Important Notes

- **Never commit `.env` file** to Git (already in `.gitignore`)
- **Keep API keys secret** - don't share publicly
- **Test locally first** before deploying
- **Monitor usage** to avoid unexpected costs
- **Start with free tiers** and scale as needed

---

**Last Updated**: [Current Date]
**Next Review**: After getting API keys
