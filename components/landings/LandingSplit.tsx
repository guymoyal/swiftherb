import { heroSrcSet, unsplashUrl } from "@/lib/landingTemplates";
import { AtAGlance, CtaButton, Disclosure, FaqSection, type LandingView } from "./shared";

/**
 * Template 2 — "Split": two-column hero (copy left, image right), checklist
 * benefits, horizontal step cards, accent mid-CTA card, FAQ, green final band.
 */
export function LandingSplit({ view }: { view: LandingView }) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <header className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
            {view.kicker}
          </span>
          {view.logo ? (
            <img
              src={view.logo}
              alt={`${view.name} logo`}
              width={140}
              height={48}
              className="mb-5 h-12 w-auto object-contain"
              fetchPriority="high"
            />
          ) : null}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 text-balance sm:text-5xl">
            {view.headline}
          </h1>
          <p className="mb-7 text-xl text-gray-600">{view.subheadline}</p>
          <CtaButton href={view.goHref} smart={view.smartCta} label={view.ctaLabel} />
          <p className="mt-3 text-sm text-gray-400">Opens the official {view.name} site.</p>
        </div>
        <img
          src={unsplashUrl(view.hero.id, 800)}
          srcSet={heroSrcSet(view.hero.id)}
          sizes="(min-width: 768px) 50vw, 100vw"
          alt={view.hero.alt}
          width={800}
          height={600}
          fetchPriority="high"
          className="aspect-[4/3] w-full rounded-3xl object-cover shadow-md"
        />
      </header>

      {/* Intro + facts */}
      {view.intro || view.descriptionHtml ? (
        <section className="mx-auto mt-14 max-w-3xl">
          {view.intro ? (
            <p className="text-lg leading-relaxed text-gray-700">{view.intro}</p>
          ) : (
            <div
              className="text-lg leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: view.descriptionHtml ?? "" }}
            />
          )}
          <div className="mt-8 rounded-2xl bg-gray-50 p-5">
            <AtAGlance view={view} />
          </div>
        </section>
      ) : null}

      {/* Benefits checklist */}
      {view.benefits.length ? (
        <section className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            What you get with {view.name}
          </h2>
          <ul className="mx-auto grid max-w-4xl gap-x-10 gap-y-6 sm:grid-cols-2">
            {view.benefits.map((b) => (
              <li key={b.title} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700"
                >
                  ✓
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Mid-page CTA card */}
      <section className="mx-auto mt-16 max-w-3xl rounded-3xl border-2 border-green-600 bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">See it for yourself</h2>
        <p className="mb-6 text-gray-600">
          The full {view.name} range, prices, and current offers live on the official site.
        </p>
        <CtaButton href={view.goHref} smart={view.smartCta} label={view.ctaLabel} size="md" />
      </section>

      {/* Steps */}
      {view.steps.length ? (
        <section className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {view.steps.slice(0, 6).map((step, i) => (
              <div key={step} className="rounded-2xl bg-gray-50 p-6">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <FaqSection faq={view.faq} className="mt-16" />

      {/* Final CTA band + disclosure */}
      <section className="mt-16 rounded-3xl bg-green-600 px-6 py-12 text-center">
        <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">{view.headline}</h2>
        <CtaButton href={view.goHref} smart={view.smartCta} label={view.ctaLabel} variant="inverse" />
      </section>
      <div className="text-center">
        <Disclosure />
      </div>
    </article>
  );
}
