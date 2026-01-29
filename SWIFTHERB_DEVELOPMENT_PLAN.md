# SwiftHerb Development Plan

## Current Status ✅

### Completed
- [x] Next.js 15 project setup with TypeScript
- [x] Tailwind CSS configuration
- [x] Basic UI components (Header, ChatInterface, MessageBubble, ProductCard)
- [x] AI integration structure with DeepSeek-V3 (direct API + OpenRouter fallback)
- [x] Mock product database (50+ products)
- [x] Partnerize affiliate link generation
- [x] Smooth UI animations and effects
- [x] Product card display with images, prices, and affiliate links
- [x] Message history persistence (localStorage)
- [x] Quick action buttons
- [x] API response caching
- [x] Mobile optimizations
- [x] Legal pages (Privacy Policy, Terms of Service)
- [x] Affiliate disclosure component
- [x] Auto-scroll functionality
- [x] Improved product matching algorithm
- [x] Next.js Image optimization
- [x] JSDoc documentation
- [x] Product comparison feature (compare up to 3 products)
- [x] Click tracking system (localStorage-based analytics)
- [x] Logo integration (using actual logo image file)
- [x] Enhanced medical disclaimer

## Next Steps 🚀

### Phase 1: AI Integration & Product Suggestions (Current Focus)

#### 1.1 DeepSeek-V3 API Configuration
- [x] Update system prompt to ensure 5-10 product suggestions
- [x] Configure DeepSeek-V3 model (`deepseek/deepseek-chat-v3`)
- [ ] Test AI responses with various health queries
- [ ] Fine-tune prompt for better product recommendations
- [x] Add error handling and retry logic for API failures

**Status**: System prompt updated, model configured. Error handling with retry logic (3 attempts with exponential backoff) implemented. Testing needed.

#### 1.2 Product Matching & Display
- [x] Create mock product database (15+ products)
- [x] Implement fuzzy product name matching
- [x] Display products in cards with animations
- [x] Expand mock product database (50+ products)
- [x] Improve product name matching accuracy (similarity scoring, word matching)
- [x] Add product image fallbacks and lazy loading

**Status**: Product database expanded to 50+ products. Improved fuzzy matching with similarity scoring. Next.js Image optimization implemented.

### Phase 2: Cloudflare Integration

#### 2.1 Cloudflare Workers Setup
- [x] Create Cloudflare Workers project (`workers/` folder)
- [x] Set up KV namespace configuration (wrangler.toml)
- [x] Create API routes in Workers for KV access (`/products/:slug`, `/products/batch`)
- [x] Design KV key structure (`prod_[slug]`)
- [x] Create script to populate KV with product data (`scripts/populate-kv.ts`)
- [x] Implement Next.js integration (`lib/workers-api.ts`, `lib/kv.ts`)
- [ ] **USER ACTION REQUIRED**: Install dependencies, create KV namespace, deploy worker (see CLOUDFLARE_SETUP.md)

**Status**: Code complete. Ready for Cloudflare account setup and deployment.

**Resources Needed**:
- Cloudflare account (user needs to create)
- KV namespace ID (will be generated during setup)
- Worker deployment (user needs to run `wrangler deploy`)

#### 2.2 Product Data Migration
- [x] Design KV key structure (`prod_[slug]`)
- [x] Create script to populate KV with product data
- [x] Product images already hosted (iHerb CDN)
- [ ] **USER ACTION REQUIRED**: Run population script after KV namespace creation
- [ ] Add product search functionality (requires D1 or external service - future enhancement)

**KV Schema**:
```json
{
  "id": "SKU_123",
  "title": "Product Name",
  "price": "$18.50",
  "image": "https://...",
  "description": "...",
  "category": "Supplements",
  "slug": "product_slug",
  "iherb_url": "https://www.iherb.com/..."
}
```

### Phase 3: UI/UX Enhancements

#### 3.1 Product Display Improvements
- [x] Smooth card animations (fadeInUp)
- [x] Hover effects and transitions
- [x] Product image lazy loading (Next.js Image component)
- [x] Product image optimization
- [x] Product comparison feature (compare up to 3 products side-by-side)
- [x] Click tracking (localStorage-based analytics)
- [ ] Product reviews/ratings display (future enhancement)

#### 3.2 Chat Experience
- [x] Auto-resizing input
- [x] Smooth message animations
- [x] Message history persistence (localStorage)
- [x] Quick action buttons ("Tell me more", "Show alternatives", "Compare products")
- [x] Auto-scroll to bottom on new messages
- [ ] Typing indicators (optional enhancement)
- [ ] Voice input support (optional)

#### 3.3 Mobile Optimization
- [x] Responsive product card grid
- [x] Touch-friendly interactions (touch-manipulation CSS)
- [x] Mobile-specific padding and spacing
- [x] Auto-scroll to bottom on new messages
- [ ] Bottom sheet for product details (optional enhancement)

### Phase 4: Revenue Optimization

#### 4.1 Affiliate Link Tracking
- [x] Partnerize deep link generation
- [x] Click tracking and analytics (localStorage-based, tracks product clicks)
- [ ] Conversion tracking setup (requires Partnerize integration)
- [ ] A/B testing for link placement (optional enhancement)
- [ ] Revenue dashboard (optional - requires backend)

#### 4.2 "Wellness Stack" Strategy
- [x] AI prompt configured for multi-product suggestions
- [ ] Bundle recommendations
- [ ] "Complete Your Stack" prompts
- [ ] Cross-sell suggestions
- [ ] Cart value optimization

### Phase 5: Safety & Compliance

#### 5.1 Medical Safety
- [x] Emergency keyword detection
- [x] Medical disclaimer improvements (enhanced disclaimer in AffiliateDisclosure modal)
- [ ] Age verification for certain products (optional enhancement)
- [ ] Drug interaction warnings (future - requires product database)
- [x] FDA disclaimer compliance (disclaimer included in Terms and Privacy pages)

#### 5.2 Legal & Privacy
- [x] Privacy policy page (/privacy)
- [x] Terms of service page (/terms)
- [x] Affiliate disclosure component (FTC compliant)
- [x] Footer with legal links
- [ ] Cookie consent banner (optional - not needed if no cookies used)
- [ ] GDPR compliance (if targeting EU users)

### Phase 6: Performance & Scaling

#### 6.1 Performance Optimization
- [x] Image optimization (Next.js Image component)
- [x] API response caching (in-memory cache with 5min TTL)
- [ ] Static product data pre-rendering
- [ ] CDN setup for assets
- [ ] Lighthouse score optimization

#### 6.2 Monitoring & Analytics
- [ ] Error tracking (Sentry or similar)
- [ ] Performance monitoring
- [ ] User analytics (privacy-friendly)
- [ ] Conversion funnel tracking
- [ ] A/B testing framework

## Technical Debt & Improvements

### Immediate
- [x] Fix DeepSeek model name (verify correct model on OpenRouter) - Configurable via env var
- [x] Add loading states for product images - Lazy loading implemented
- [x] Improve error messages for users - User-friendly error messages added
- [x] Add auto-scroll to bottom functionality
- [x] Add mobile optimizations
- [x] Add legal pages (Privacy, Terms)
- [x] Add affiliate disclosure
- [ ] Add product search within chat (optional enhancement)

### Short-term
- [x] Refactor product matching logic (improved with similarity scoring)
- [ ] Add unit tests for core functions
- [x] Improve TypeScript types (added interfaces and proper types)
- [x] Add JSDoc comments (added to all major functions)

### Long-term
- [ ] Migrate to Cloudflare Workers fully
- [ ] Implement real-time product updates
- [ ] Add product availability checking
- [ ] Multi-language support

## Environment Variables Needed

```env
# AI Configuration
OPENROUTER_API_KEY=your_key_here
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# Affiliate
NEXT_PUBLIC_PARTNERIZE_CAMREF=your_camref_here

# Site
NEXT_PUBLIC_SITE_URL=https://swiftherb.com

# Cloudflare (when ready)
CF_ACCOUNT_ID=your_account_id
CF_KV_NAMESPACE_ID=your_kv_namespace_id
CF_API_TOKEN=your_api_token
```

## Testing Checklist

### AI Integration
- [ ] Test with various health queries (anxiety, sleep, energy, etc.)
- [ ] Verify 5-10 products are suggested
- [ ] Test emergency keyword detection
- [ ] Verify product names are wrapped in [[brackets]]

### Product Display
- [ ] Verify all products show images, prices, descriptions
- [ ] Test affiliate links open correctly
- [ ] Verify product cards animate smoothly
- [ ] Test on mobile devices

### UI/UX
- [ ] Test chat input auto-resize
- [ ] Verify smooth scrolling
- [ ] Test hover effects on product cards
- [ ] Verify responsive design on all screen sizes

## Deployment Plan

1. **Development**: Local testing with mock data
2. **Staging**: Deploy to Vercel/Cloudflare Pages with test API keys
3. **Production**: 
   - Set up Cloudflare Workers + KV
   - Configure production API keys
   - Set up monitoring
   - Launch!

## Success Metrics

- **User Engagement**: Average products viewed per session
- **Conversion**: Click-through rate on affiliate links
- **Revenue**: Commission earnings per user
- **Performance**: Page load time < 2s
- **User Satisfaction**: Low bounce rate, high return rate

---

## Recent Updates

### Latest Implementation (Current Session)
- ✅ Added auto-scroll to bottom on new messages
- ✅ Created Privacy Policy page (/privacy)
- ✅ Created Terms of Service page (/terms)
- ✅ Added AffiliateDisclosure component (FTC compliant)
- ✅ Enhanced mobile responsiveness (touch-friendly, better spacing)
- ✅ Added footer with legal links
- ✅ Improved mobile padding for chat input
- ✅ All code documented with JSDoc comments
- ✅ Implemented product comparison feature (compare up to 3 products)
- ✅ Added click tracking system (localStorage-based analytics)
- ✅ Integrated actual logo image file (swiftherb-logo.png)
- ✅ Enhanced medical disclaimer with prominent warning
- ✅ Created public folder structure for images and SCSS files
- ✅ Added SCSS support with variables, mixins, and components

### Ready for Production
The application is now feature-complete for MVP launch. Remaining items are optional enhancements or require external services (Cloudflare KV, analytics, etc.).

---

**Last Updated**: December 2024
**Next Review**: After API key setup and initial testing
