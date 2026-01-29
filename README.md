# SwiftHerb - AI Pharmacist Assistant

A low-latency AI pharmacist assistant that converts chat queries into high-value iHerb commissions.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS
- **Backend Infrastructure:** Cloudflare Workers (Edge Computing)
- **Data Persistence:** Cloudflare Workers KV (Key-Value Store)
- **AI Model:** DeepSeek-V3 (via OpenRouter)
- **Affiliate Integration:** Partnerize (Deep Linking via `prf.hn`)

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Copy the environment variables:
```bash
cp .env.example .env
```

3. Fill in your environment variables in `.env`:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `NEXT_PUBLIC_PARTNERIZE_CAMREF`: Your Partnerize CAMREF ID
   - `NEXT_PUBLIC_SITE_URL`: Your site URL (for development: `http://localhost:3000`)

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
swiftherb/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Sticky header with logo
│   ├── ChatInterface.tsx # Main chat UI
│   ├── MessageBubble.tsx  # Message display component
│   ├── ChatInput.tsx      # Chat input component
│   ├── ProductCard.tsx    # Product display card
│   └── DisclaimerBar.tsx  # Fixed disclaimer bar
├── lib/                   # Utility functions
│   ├── ai.ts             # AI integration (OpenRouter)
│   ├── kv.ts             # Cloudflare KV operations
│   └── partnerize.ts     # Partnerize link generation
└── SWIFTHERB_MASTER_PLAN.md # Project master plan
```

## Features

- **AI-Powered Chat:** Conversational interface powered by DeepSeek-V3
- **Product Recommendations:** AI suggests products wrapped in `[[Double Brackets]]`
- **Affiliate Links:** Automatic Partnerize deep linking for all product recommendations
- **Safety Features:** Emergency keyword detection for medical emergencies
- **Wellness Stacks:** AI suggests multiple products for higher cart values

## Next Steps

1. Set up Cloudflare Workers and KV namespace
2. Populate KV store with product data
3. Implement product metadata fetching from KV
4. Add error handling and loading states
5. Deploy to Cloudflare Pages

## License

Private project - All rights reserved
