"use client";

/**
 * Experimental ad-blocker-resistant CTA.
 *
 * Renders a normal affiliate anchor (crawlers and no-JS users get the plain
 * link). On click it tries to open the offer in a new tab; if a blocker using
 * a `$popup`-style rule kills that tab (window.open returns null, or the tab is
 * closed within ~700ms), it falls back to navigating the current tab instead.
 *
 * Limitation: if the blocker blocks the tracker domain as a general network
 * request (not just popups), the same-tab navigation is blocked too — nothing
 * client-side can (or should) defeat that.
 */
export function SmartCtaButton({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className: string;
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let modifier-clicks (open in new tab/window, copy) behave normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();

    let win: Window | null = null;
    try {
      // No "noopener" here on purpose: that would force a null return and
      // defeat the closed-tab detection below.
      win = window.open(href, "_blank");
    } catch {
      win = null;
    }

    if (!win) {
      // Popup blocked outright — go in the same tab.
      window.location.href = href;
      return;
    }

    // Some blockers open then immediately close the tab. Detect and recover.
    window.setTimeout(() => {
      let closed = false;
      try {
        closed = win!.closed;
      } catch {
        closed = false; // cross-origin but alive — leave it open
      }
      if (closed) window.location.href = href;
    }, 700);
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
