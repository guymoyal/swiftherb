# Ad-blocker-resistant affiliate CTA

A small, portable technique to keep affiliate / tracker links working for visitors
who run ad blockers. Used on every SwiftHerb partner landing page.

## The problem

Affiliate links go through a tracker domain (e.g. `tatrck.com`, `go.skimresources.com`,
`prf.hn`). Ad blockers fight these in two different ways:

1. **Cosmetic / pattern filtering** — they hide or strip the link because the URL
   matches a known tracker pattern. The button looks broken or disappears.
2. **`$popup` rules** — they *allow* the click but kill any new browser tab/window
   that the click tries to open. The user clicks, a tab flashes open and instantly
   closes, and **nothing happens**.

Most "open in new tab" affiliate buttons silently fail under case 2.

## The two-part fix

### Part 1 — First-party redirect (defeats pattern filtering)

Never put the raw tracker URL in the page's `href`. Instead link to a path on your
**own** domain that 302-redirects to the tracker:

```
/go/<slug>/   →  302  →  https://tracker.example/h/abc?url=https%3A%2F%2Fmerchant.com
```

Ad blockers can't pattern-match `yoursite.com/go/sephora-sg/`, so the button stays
visible and clickable. On Cloudflare Pages this is just lines in `public/_redirects`:

```
/go/sephora-sg   https://tatrck.com/h/0Jm30_BU14lx?url=https%3A%2F%2Fsephora.sg   302
/go/sephora-sg/  https://tatrck.com/h/0Jm30_BU14lx?url=https%3A%2F%2Fsephora.sg   302
```

(Any server-side 30x redirect works — Nginx, a serverless function, Next.js
`redirects()`, etc.)

### Part 2 — Open-then-fallback click handler (defeats `$popup` rules)

On click:

1. `window.open(href, "_blank")` — try the new tab.
2. If it returns `null`, the popup was blocked outright → navigate the **same tab**.
3. Otherwise wait **1 second**, then check `win.closed`. If the blocker opened and
   immediately closed the tab, `closed` is `true` → navigate the **same tab**.

Same-tab navigation isn't pattern-matched the way a popup is, so the visitor still
reaches the offer instead of getting nothing.

> **Important:** do **not** pass `"noopener"` to `window.open`. With `noopener` the
> call returns `null` immediately and you lose the ability to detect the closed tab.
> Keep `rel="...noopener..."` on the anchor for the no-JS path, but let the JS
> `window.open` keep the handle.

## Reusable component (React / Next.js)

```tsx
"use client";

export function SmartCtaButton({
  href,
  label,
  className,
}: {
  href: string;   // first-party redirect, e.g. "/go/sephora-sg/"
  label: string;
  className: string;
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modifier-clicks (open in new tab, copy link, middle-click) behave normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();

    let win: Window | null = null;
    try {
      // No "noopener" on purpose — it would force a null return and defeat detection.
      win = window.open(href, "_blank");
    } catch {
      win = null;
    }

    if (!win) {
      window.location.href = href; // popup blocked outright → same tab
      return;
    }

    // Some blockers open then immediately close the tab. After 1s, recover.
    window.setTimeout(() => {
      let closed = false;
      try {
        closed = win!.closed;
      } catch {
        closed = false; // cross-origin but alive — leave it open
      }
      if (closed) window.location.href = href;
    }, 1000);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}
```

## Framework-agnostic version (plain HTML + JS)

Drop this anywhere. Every link with `data-smart-cta` gets the behavior.

```html
<a href="/go/sephora-sg/" data-smart-cta target="_blank"
   rel="sponsored nofollow noopener noreferrer">Visit Sephora</a>

<script>
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-smart-cta]");
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();

    var href = a.getAttribute("href");
    var win = null;
    try { win = window.open(href, "_blank"); } catch (_) { win = null; }

    if (!win) { window.location.href = href; return; }

    setTimeout(function () {
      var closed = false;
      try { closed = win.closed; } catch (_) { closed = false; }
      if (closed) window.location.href = href;
    }, 1000);
  });
</script>
```

## What it does NOT do

If the blocker blocks the tracker **domain itself** as a network request (not just
popups), the same-tab navigation is refused too — the browser never reaches the
tracker. No client-side code can (or should) get past that; it would require a
server-side click-registration approach (e.g. a Cloudflare Worker that records the
click and then redirects). The technique here only handles the far more common
popup-rule and cosmetic-filtering cases.

## Checklist to reuse elsewhere

- [ ] Add a first-party `/go/<slug>/` 302 redirect to each tracker URL.
- [ ] Point the button `href` at `/go/<slug>/`, never the raw tracker URL.
- [ ] Use the open-then-fallback click handler (React component or HTML snippet above).
- [ ] Keep `rel="sponsored nofollow noopener noreferrer"` for SEO + no-JS safety.
- [ ] Do **not** pass `"noopener"` to `window.open`.
