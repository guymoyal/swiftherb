import { heroSrcSet, unsplashUrl } from "@/lib/landingTemplates";
import { AtAGlance, CtaButton, Disclosure, FaqSection, type LandingView } from "./shared";

/**
 * Template 3 — "Editorial": narrow magazine-style column, large title over a
 * full-width image, accent-bordered benefits, inline mid CTA, FAQ, closing card.
 */
export function LandingEditorial({ view }: { view: LandingView }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {/* Title block */}
      <header>
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-700">
          {view.kicker}
        </p>
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-gray-900 text-balance sm:text-5xl">
          {view.headline}
        </h1>
        <p className="mb-6 text-xl leading-relaxed text-gray-600">{view.subheadline}</p>
        {view.logo ? (
          <div className="mb-6 flex items-center gap-3 border-y border-gray-100 py-4">
            <img
              src={view.logo}
              alt={`${view.name} logo`}
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              fetchPriority="high"
            />
            {view.officialDomain ? (
              <span className="text-sm text-gray-400">{view.officialDomain}</span>
            ) : null}
          </div>
        ) : null}
        <img
          src={unsplashUrl(view.hero.id, 1200)}
          srcSet={heroSrcSet(view.hero.id)}
          sizes="(min-width: 768px) 736px, 100vw"
          alt={view.hero.alt}
          width={1200}
          height={675}
          fetchPriority="high"
          className="aspect-video w-full rounded-2xl object-cover"
        />
      </header>

      {/* Intro */}
      <section className="mt-10">
        {view.intro ? <p className="text-lg leading-relaxed text-gray-700">{view.intro}</p> : null}
        {view.descriptionHtml ? (
          <div
            className="text-lg leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{ __html: view.descriptionHtml }}
          />
        ) : null}
      </section>

      {/* Mid CTA */}
      <section className="my-12 text-center">
        <CtaButton href={view.goHref} label={view.ctaLabel} />
        <p className="mt-3 text-sm text-gray-400">Opens the official {view.name} site.</p>
      </section>

      {/* Benefits — stacked editorial list */}
      {view.benefits.length ? (
        <section>
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Why {view.name}?</h2>
          <div className="space-y-7">
            {view.benefits.map((b) => (
              <div key={b.title} className="border-l-4 border-green-600 pl-5">
                <h3 className="mb-1 text-lg font-semibold text-gray-900">{b.title}</h3>
                <p className="leading-relaxed text-gray-600">{b.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Steps */}
      {view.steps.length ? (
        <section className="mt-14">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">How it works</h2>
          <ol className="space-y-4">
            {view.steps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                  {i + 1}
                </span>
                <p className="pt-1 leading-relaxed text-gray-700">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* At a glance */}
      <section className="mt-14 rounded-2xl bg-gray-50 p-6">
        <AtAGlance view={view} />
      </section>

      <FaqSection faq={view.faq} className="mt-14" />

      {/* Closing CTA card + disclosure */}
      <section className="mt-14 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Take the next step</h2>
        <p className="mb-6 text-gray-600">{view.subheadline}</p>
        <CtaButton href={view.goHref} label={view.ctaLabel} />
        <Disclosure />
      </section>
    </article>
  );
}
