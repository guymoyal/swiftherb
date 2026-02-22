# PROJECT: SwiftHerb.com - Low-Latency AI Pharmacist
# PRIMARY GOAL: Convert chat queries into high-value iHerb commissions.

## 1. TECHNICAL STACK & ARCHITECTURE
- **Frontend:** Next.js 15 (App Router), Tailwind CSS.
- **Backend Infrastructure:** Cloudflare Workers (Edge Computing).
- **Data Persistence:** Cloudflare Workers KV (Key-Value Store).
- **AI Model:** DeepSeek-V3 (via OpenRouter or direct API).
- **Affiliate Integration:** Partnerize (Deep Linking via `prf.hn`).

## 2. DATABASE SCHEMA (Cloudflare KV)
To ensure "Swift" responses, the product data must be structured. 
- **Key:** `prod_[PRODUCT_SLUG]` (e.g., `prod_magnesium_glycinate`)
- **Value (JSON):** {
    "id": "SKU_123",
    "title": "Doctor's Best Magnesium Glycinate",
    "price": "$18.50",
    "image": "https://images.iherb.com/m/DRB-00087-5.jpg",
    "description": "High absorption magnesium to support muscle and sleep.",
    "category": "Supplements"
  }

## 3. CORE LOGIC & FUNCTIONS

### A. The Deep-Link Encoder (Partnerize)
The link must be robust. Every product name must be URI-encoded.
- **Function:** `generateLink(keyword)`
- **Logic:** `const encoded = encodeURIComponent(keyword);`
- **Output:** `https://prf.hn/click/camref:[YOUR_CAMREF]/destination:https://www.iherb.com/search?kw=${encoded}`

### B. The AI Persona (System Prompt)
"You are SwiftHerb AI, a clinical pharmacist assistant. 
1. **Persona:** Analytical, safe, and fast.
2. **Behavior:** Analyze symptoms -> Suggest 2-3 iHerb categories -> Match with specific products.
3. **Format:** You MUST wrap recommended products in [[Double Brackets]]. 
4. **Safety:** If a user mentions chest pain, difficulty breathing, or suicidal thoughts, STOP the pharmacist persona and give an IMMEDIATE emergency warning."

## 4. UI/UX REQUIREMENTS (ChatGPT-Green Theme)
- **Header:** Sticky top, "SwiftHerb" logo at left (220x50px).
- **Disclaimer Bar:** Fixed bottom-of-screen text: "Not medical advice. Commissions may be earned."
- **Message Parsing:** - IF response contains `[[Product Name]]`:
  - THEN: Query KV store for metadata.
  - RENDER: `ProductCard` component below the text bubble.

## 5. REVENUE MAXIMIZATION (The "Stack" Strategy)
- Logic: When a user asks about a problem (e.g., "Anxiety"), the AI should not suggest one product. It should suggest a "Wellness Stack" of 3 items. 
- *Why:* Higher chance of a $100+ cart, setting the 7-day Partnerize cookie for the entire basket.
