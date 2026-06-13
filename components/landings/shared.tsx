import Link from "next/link";
import type { PartnerLanding } from "@/lib/partnerLandings";
import { pickHeroImage, type HeroImage } from "@/lib/landingTemplates";
import { SmartCtaButton } from "./SmartCtaButton";

/** Pre-computed view model shared by every landing template. */
export interface LandingView {
  name: string;
  gotolink: string;
  /** First-party redirect (/go/<slug>/) — ad blockers can't pattern-match the tracker domain. */
  goHref: string;
  logo: string | null;
  kicker: string;
  headline: string;
  subheadline: string;
  intro: string | null;
  descriptionHtml: string | null;
  benefits: Array<{ title: string; description: string }>;
  steps: string[];
  faq: Array<{ question: string; answer: string }>;
  ctaLabel: string;
  hero: HeroImage;
  officialDomain: string | null;
  categories: string[];
  smartCta: boolean;
}

export function buildLandingView(landing: PartnerLanding): LandingView {
  const { program, content, gotolink } = landing;
  const categories = program.categories.map((c) => c.name).filter(Boolean);
  let officialDomain: string | null = null;
  if (program.siteUrl) {
    try {
      officialDomain = new URL(program.siteUrl).hostname.replace(/^www\./, "");
    } catch {
      officialDomain = program.siteUrl;
    }
  }
  return {
    name: program.name,
    gotolink,
    goHref: `/go/${landing.slug}/`,
    logo: program.image,
    kicker: categories[0] ?? "Partner offer",
    headline: content?.headline ?? program.name,
    subheadline: content?.subheadline ?? (officialDomain ? `Official partner offer from ${officialDomain}` : "Partner offer"),
    intro: content?.intro ?? null,
    descriptionHtml: !content && program.description ? program.description : null,
    benefits: content?.benefits ?? [],
    steps: content?.howItWorks ?? [],
    faq: content?.faq ?? [],
    ctaLabel: content?.ctaLabel ?? `Visit ${program.name}`,
    hero: pickHeroImage(landing.slug, program.name, categories),
    officialDomain,
    categories,
    // Every affiliate CTA uses the ad-blocker-resistant click handler.
    smartCta: true,
  };
}

export function CtaButton({
  href,
  label,
  variant = "solid",
  size = "lg",
  smart = false,
}: {
  href: string;
  label: string;
  variant?: "solid" | "inverse";
  size?: "lg" | "md";
  /** Use the client-side popup-block fallback (experimental, opt-in per page). */
  smart?: boolean;
}) {
  const className = ctaClassName(variant, size);
  if (smart) {
    return <SmartCtaButton href={href} label={label} className={className} />;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}

export function ctaClassName(variant: "solid" | "inverse", size: "lg" | "md"): string {
  const palette =
    variant === "inverse"
      ? "bg-white text-green-700 hover:bg-green-50"
      : "bg-green-600 text-white hover:bg-green-700";
  const sizing = size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base";
  return `inline-block rounded-xl font-semibold shadow-md transition-colors ${palette} ${sizing}`;
}

export function Disclosure() {
  return (
    <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-gray-400">
      Disclosure: this page contains affiliate links — if you buy through them, SwiftHerb may
      earn a commission at no extra cost to you. See our{" "}
      <Link href="/affiliate-disclosure/" className="underline hover:text-gray-600">
        affiliate disclosure
      </Link>
      . Content here is general information about the brand and is not medical advice; always
      read product labels and consult a professional where appropriate.
    </p>
  );
}

/** FAQ rendered with <details> — interactive with zero client-side JavaScript. */
export function FaqSection({ faq, className = "" }: { faq: LandingView["faq"]; className?: string }) {
  if (!faq.length) return null;
  return (
    <section className={className}>
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
        Frequently asked questions
      </h2>
      <div className="mx-auto max-w-2xl space-y-3">
        {faq.map((f) => (
          <details
            key={f.question}
            className="group rounded-xl border border-gray-200 bg-white p-5"
          >
            <summary className="cursor-pointer list-none font-medium text-gray-900">
              {f.question}
            </summary>
            <p className="mt-3 text-gray-600">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Compact entity facts — helps answer engines (AEO) pin down who the page is about. */
export function AtAGlance({ view }: { view: LandingView }) {
  const facts: Array<[string, string]> = [["Brand", view.name]];
  if (view.officialDomain) facts.push(["Official site", view.officialDomain]);
  if (view.categories.length) facts.push(["Category", view.categories.join(", ")]);
  return (
    <dl className="mx-auto flex max-w-2xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
      {facts.map(([term, value]) => (
        <div key={term} className="flex gap-2">
          <dt className="font-semibold text-gray-900">{term}:</dt>
          <dd className="text-gray-600">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
