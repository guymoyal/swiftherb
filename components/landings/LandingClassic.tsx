import { heroSrcSet, unsplashUrl } from "@/lib/landingTemplates";
import { AtAGlance, CtaButton, Disclosure, FaqSection, type LandingView } from "./shared";

/**
 * Template 1 — "Classic": centered hero with logo + full-width imagery, card
 * benefits grid, green mid-page CTA band, numbered steps, FAQ, final CTA.
 */
export function LandingClassic({ view }: { view: LandingView }) {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <header className="text-center">
        <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
          {view.kicker}
        </span>
        {view.logo ? (
          <img
            src={view.logo}
            alt={`${view.name} logo`}
            width={180}
            height={64}
            className="mx-auto mb-6 h-16 w-auto object-contain"
            fetchPriority="high"
          />
        ) : null}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 text-balance sm:text-5xl">
          {view.headline}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">{view.subheadline}</p>
        <CtaButton href={view.goHref} smart={view.smartCta} label={view.ctaLabel} />
        <img
          src={unsplashUrl(view.hero.id, 1200)}
          srcSet={heroSrcSet(view.hero.id)}
          sizes="(min-width: 1024px) 1024px, 100vw"
          alt={view.hero.alt}
          width={1200}
          height={500}
          loading="lazy"
          className="mx-auto mt-10 h-56 w-full rounded-3xl object-cover shadow-sm sm:h-80"
        />
      </header>

      {/* Intro + facts */}
      <section className="mx-auto mt-12 max-w-2xl">
        {view.intro ? <p className="text-lg leading-relaxed text-gray-700">{view.intro}</p> : null}
        {view.descriptionHtml ? (
          <div
            className="text-lg leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: view.descriptionHtml }}
          />
        ) : null}
        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50/50 p-5">
          <AtAGlance view={view} />
        </div>
      </section>

      {/* Benefits */}
      {view.benefits.length ? (
        <section className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Why {view.name}?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {view.benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-semibold text-gray-900">{b.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{b.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Mid-page CTA band */}
      <section className="mt-16 rounded-3xl bg-green-600 px-6 py-12 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
          Ready to take a look at {view.name}?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-green-50">
          Browse the official range and current offers — it only takes a minute.
        </p>
        <CtaButton href={view.goHref} smart={view.smartCta} label={view.ctaLabel} variant="inverse" />
      </section>

      {/* How it works */}
      {view.steps.length ? (
        <section className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">How it works</h2>
          <ol className="mx-auto max-w-2xl space-y-4">
            {view.steps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-gray-700">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <FaqSection faq={view.faq} className="mt-16" />

      {/* Final CTA + disclosure */}
      <section className="mt-16 text-center">
        <CtaButton href={view.goHref} smart={view.smartCta} label={view.ctaLabel} />
        <Disclosure />
      </section>
    </article>
  );
}
