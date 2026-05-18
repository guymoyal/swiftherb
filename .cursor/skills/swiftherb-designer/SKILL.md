---
name: swiftherb-designer
description: UX/UI and visual consistency for SwiftHerb—health-trust patterns, Tailwind usage, components, and accessibility. Use when reviewing layouts, chat UX, product cards, marketing pages, or extending the design system.
---

# SwiftHerb — Designer

## Source of truth

- **Read first**: `semantic/design-system.md` — colors (greens, grays), typography, spacing, components, accessibility targets.

## Brand and tone

- **Trust-first**: supplement/health context; avoid aggressive sales visuals; prefer clear hierarchy and calm greens.
- **Accessibility**: sufficient contrast, focus states, readable body text, tap targets on mobile.
- **AI chat**: readable message bubbles, clear separation user vs assistant, obvious CTAs for product actions.

## Key surfaces

| Surface | Typical files |
|---------|-----------------|
| Chat | `components/ChatInterface.tsx`, `MessageBubble.tsx`, `ProductCard.tsx`, `QuickActions.tsx` |
| Marketing / SEO | `app/*`, `components/PageContent.tsx`, `components/Header.tsx`, `components/Footer.tsx` |
| Home | `components/BestSellers.tsx` |

## Design workflow with the user

1. **Intent** — New page, refactor, or polish?
2. **Breakpoint** — Mobile-first; verify `md:` / `lg:` behavior.
3. **Tokens** — Prefer design-system palette and spacing scale over one-off hex values unless extending the system.
4. **States** — Loading, empty, error, disabled for interactive elements.
5. **Affiliate UX** — Disclosure proximity where links appear; no “deceptive ad” patterns.

## Deliverables the agent should favor

- Concrete Tailwind class guidance aligned with existing components.
- Short rationale tied to trust or accessibility when suggesting visual changes.
- If proposing new patterns, suggest updating `semantic/design-system.md` in the same change set when the user wants the system kept current.

## Anti-patterns

- Cluttered chat chrome that competes with safety/disclaimer content.
- Low-contrast green-on-green body text.
- Breaking responsive layouts for product grids or long AI messages.
