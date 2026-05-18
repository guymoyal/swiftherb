# Fullstack Developer - SwiftHerb Project

## Role Overview
A fullstack developer working on SwiftHerb should be proficient in modern web development technologies, API integration, and building scalable, performant applications. This role requires expertise in both frontend and backend development, with a focus on Next.js, Cloudflare Workers, and affiliate marketing integrations.

## Technical Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)
- **UI Components**: Custom React components
- **Deployment**: Cloudflare Pages (static export)

### Backend
- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Storage**: Cloudflare KV (Key-Value Store)
- **APIs**: RESTful API design
- **Scheduling**: Cloudflare Cron Triggers

### External Integrations
- **AI Provider**: DeepSeek API (via OpenRouter)
- **Affiliate Network**: Admitad API (OAuth2, Product Feeds, Deeplinks)
- **Image Service**: Unsplash API (optional)
- **Analytics**: Custom tracking (prepared for future integration)

## Core Responsibilities

### 1. Frontend Development

#### Component Architecture
- Build reusable, accessible React components
- Implement responsive designs using Tailwind CSS
- Ensure proper TypeScript typing for all components
- Follow the design system guidelines (see `semantic/design-system.md`)

#### Key Components to Maintain
- `ChatInterface.tsx` - Main chat UI with message handling
- `ProductCard.tsx` - Product display component
- `BestSellers.tsx` - Homepage product showcase
- `MessageBubble.tsx` - Chat message rendering
- `QuickActions.tsx` - Action buttons for AI responses
- `ResetConfirmModal.tsx` - Confirmation dialogs

#### State Management
- Use React hooks for local component state
- Implement proper loading states and error handling
- Manage conversation history (localStorage)
- Handle scroll synchronization for chat interface

#### Performance Optimization
- Implement lazy loading for images
- Optimize bundle size (code splitting)
- Minimize re-renders with proper React patterns
- Ensure fast Time to Interactive (TTI)

### 2. Backend Development

#### Cloudflare Workers
- Build and maintain API endpoints (`workers/src/chat.ts`)
- Implement scheduled tasks (`workers/src/update-products.ts`)
- Handle OAuth2 authentication flows
- Manage KV storage operations

#### API Design
- RESTful endpoints for chat interactions
- Product data synchronization
- Affiliate link generation
- Error handling and logging

#### Data Management
- Sync product data from Admitad API to KV
- Implement fallback mechanisms (Admitad → iHerb → Mock)
- Handle product matching and fuzzy search
- Cache management for API responses

### 3. API Integration

#### Admitad Integration
- OAuth2 token management
- Product feed fetching and parsing
- Deeplink generation
- Error handling and retry logic

#### AI Integration
- OpenRouter API integration
- System prompt engineering
- Response parsing and product extraction
- Streaming support (future enhancement)

### 4. DevOps & Deployment

#### Build & Deploy
- Configure Next.js for static export
- Deploy to Cloudflare Pages
- Deploy Cloudflare Workers
- Set up environment variables and secrets

#### Monitoring & Debugging
- Use `wrangler tail` for worker logs
- Implement proper error logging
- Monitor API response times
- Track deployment status

## Key Skills Required

### Essential
- **TypeScript**: Strong typing skills, interface design
- **React**: Hooks, component lifecycle, performance optimization
- **Next.js**: App Router, Server Components, Metadata API
- **Tailwind CSS**: Utility-first styling, responsive design
- **REST APIs**: Design, implementation, error handling
- **Git**: Version control, branching strategies

### Important
- **Cloudflare Workers**: Edge computing, KV storage, Cron triggers
- **OAuth2**: Authentication flows, token management
- **API Integration**: Third-party API consumption, error handling
- **Performance**: Bundle optimization, lazy loading, caching
- **Accessibility**: WCAG compliance, semantic HTML, ARIA

### Nice to Have
- **AI/LLM**: Prompt engineering, response parsing
- **Affiliate Marketing**: Understanding of affiliate networks
- **SEO**: Meta tags, structured data, sitemaps
- **Testing**: Unit tests, integration tests, E2E tests

## Development Workflow

### Local Development
1. Install dependencies: `npm install` or `pnpm install`
2. Set up environment variables in `.env`
3. Run dev server: `npm run dev`
4. Run workers locally: `cd workers && wrangler dev`

### Code Quality
- Use TypeScript strict mode
- Follow ESLint rules
- Write self-documenting code with JSDoc comments
- Maintain consistent code style

### Testing Checklist
- [ ] Components render correctly
- [ ] API endpoints return expected data
- [ ] Error states are handled gracefully
- [ ] Mobile responsiveness works
- [ ] Accessibility standards met
- [ ] Performance metrics acceptable

## Common Tasks

### Adding a New Component
1. Create component file in `components/`
2. Add TypeScript interfaces
3. Implement with Tailwind CSS
4. Add to parent component
5. Test responsive behavior
6. Ensure accessibility

### Integrating a New API
1. Add API credentials to `.env`
2. Create utility functions in `lib/`
3. Add error handling and fallbacks
4. Update TypeScript types
5. Test integration locally
6. Deploy and monitor

### Debugging Issues
1. Check browser console for frontend errors
2. Use `wrangler tail` for worker logs
3. Verify environment variables are set
4. Test API endpoints directly with `curl`
5. Check Cloudflare dashboard for deployment status

## File Structure Understanding

```
swiftherb/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ChatInterface.tsx  # Main chat component
│   ├── ProductCard.tsx    # Product display
│   └── ...
├── lib/                   # Utility functions
│   ├── affiliate.ts      # Affiliate link generation
│   ├── admitad.ts        # Admitad API functions
│   └── products.ts       # Product data utilities
├── workers/               # Cloudflare Workers
│   └── src/
│       ├── chat.ts       # Chat API endpoint
│       └── update-products.ts  # Scheduled product sync
└── semantic/              # Design system docs
```

## Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **API Response Time**: < 500ms (p95)

## Security Considerations

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate and sanitize user inputs
- Implement rate limiting (future)
- Use HTTPS for all API calls
- Follow OWASP best practices

## Future Enhancements

### Planned Features
1. Real-time chat streaming (SSE/WebSocket)
2. User authentication and profiles
3. Product comparison feature
4. Saved recommendations
5. Email notifications
6. Advanced search and filtering
7. Product reviews integration
8. Multi-language support

### Technical Debt
- Add comprehensive test coverage
- Implement error boundary components
- Add monitoring and analytics
- Optimize image loading strategy
- Implement service worker for offline support
- Add E2E tests with Playwright/Cypress

## Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs/

### Internal Docs
- Design System: `semantic/design-system.md`
- Deployment Guide: `DEPLOYMENT.md`
- Next Steps: `NEXT_STEPS.md`
- Suggestions: `suggestions.md`

---

*Last Updated: February 2025*
*Role Definition Version: 1.0*
