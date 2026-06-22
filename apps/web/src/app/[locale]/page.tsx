import { setRequestLocale, getTranslations } from "next-intl/server";
import { getCalc, listCalcs, POPULAR_CALC_IDS } from "@medcalc/calculators";
import { Link } from "@/i18n/navigation";
import { Catalog } from "@/components/Catalog";
import { Reveal } from "@/components/Reveal";
import { BASE_URL } from "@/lib/site";

const DOI = "10.5281/zenodo.20562617";
const DOI_URL = `https://doi.org/${DOI}`;
const REPO_URL = "https://github.com/laurapiro17/medikquantis";

// Serialise JSON-LD safely for inline <script>. Escapes `<`, `>` and `&`
// so a hostile string in `description` (sourced from i18n) can never close
// the script tag or break the surrounding HTML context.
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const calcs = listCalcs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MedikQuantis",
    description: t("site.tagline"),
    url: REPO_URL,
    applicationCategory: "MedicalApplication",
    operatingSystem: "Web",
    softwareVersion: "2.0.0",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    inLanguage: ["ca", "es", "en"],
    author: {
      "@type": "Organization",
      name: "MedikQuantis",
      url: BASE_URL,
    },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "DOI",
      value: DOI,
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "MedikQuantis",
        url: `${BASE_URL}/${locale}`,
        inLanguage: locale,
        description: t("site.tagline"),
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/${locale}?q={search_term_string}#catalog`,
          },
          "query-input": "required name=search_term_string",
        },
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "MedikQuantis",
        url: BASE_URL,
        sameAs: [REPO_URL, "https://orcid.org/0009-0008-3390-4029", DOI_URL],
      },
    ],
  };

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(siteJsonLd) }}
      />

      <section className="relative isolate space-y-6 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-24 -top-32 -z-10 h-[520px] bg-mesh animate-mesh-drift"
        />
        <p className="eyebrow animate-rise text-trust-600 dark:text-neon">
          {t("home.hero_eyebrow")}
        </p>
        <h1
          style={{ animationDelay: "60ms" }}
          className="animate-rise text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-7xl dark:text-slate-50"
        >
          {t("home.hero_heading")}
        </h1>
        <p
          style={{ animationDelay: "120ms" }}
          className="animate-rise max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          {t("home.hero_subheading")}
        </p>
        <div
          style={{ animationDelay: "180ms" }}
          className="animate-rise flex flex-wrap gap-3 pt-2"
        >
          <Link
            href={`/${POPULAR_CALC_IDS[0]}`}
            className="press btn-primary rounded-md px-5 py-2.5 text-sm font-medium text-white shadow-trust"
          >
            {t("home.hero_cta_calcs")}
          </Link>
          <Link
            href="#catalog"
            className="press rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-trust-500 hover:text-trust-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-neon/50 dark:hover:text-neon"
          >
            {t("home.catalog_heading")}
          </Link>
          <a
            href="/api/v1/docs"
            className="press self-center text-sm font-medium text-slate-600 hover:text-trust-700 dark:text-slate-300 dark:hover:text-neon"
          >
            {t("home.hero_cta_api")} <span aria-hidden="true">→</span>
          </a>
        </div>
        <ul className="flex flex-wrap gap-2 pt-1 text-xs">
          <li className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            MIT
          </li>
          <li>
            <a
              href={DOI_URL}
              className="press rounded-full bg-slate-100 px-2.5 py-1 font-mono text-trust-600 hover:underline dark:bg-white/5 dark:text-neon"
            >
              DOI
            </a>
          </li>
          <li className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {t("home.value_3_title")}
          </li>
        </ul>
      </section>

      <ul className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <li key={n}>
            <Reveal delay={(n - 1) * 70} className="h-full">
              <div className="glass-panel card-lift h-full p-5">
                <span className="mb-3 block h-1 w-8 rounded-full bg-gradient-to-r from-trust-600 to-trust-300 dark:from-neon dark:to-trust-400" />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t(`home.value_${n}_title` as "home.value_1_title")}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {t(`home.value_${n}_body` as "home.value_1_body")}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <section
        id="api"
        className="glass-panel relative p-6"
      >
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("home.api_callout_heading")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 sm:max-w-xl">
              {t("home.api_callout_body")}
            </p>
          </div>
          <a
            href="/api/v1/docs"
            className="shrink-0 self-start rounded-md border border-trust-500 px-4 py-2 text-sm font-medium text-trust-700 transition hover:bg-trust-50 sm:self-center dark:border-neon/50 dark:text-neon dark:hover:bg-white/5"
          >
            {t("home.api_callout_cta")} →
          </a>
        </Reveal>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-trust-500/40 to-transparent"
        />
      </section>

      <section id="popular" className="space-y-6 scroll-mt-24">
        <Reveal>
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {t("home.popular_heading")}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("home.popular_subheading")}
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <hr className="rule-draw neon-divider mt-4" />
        </Reveal>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_CALC_IDS.map((id, i) => {
            const calc = getCalc(id);
            if (!calc) return null;
            return (
              <li key={id}>
                <Reveal delay={Math.min(i, 6) * 55} className="h-full">
                  <Link
                    href={`/${id}`}
                    className="press glass-panel block h-full p-4 transition card-lift hover:border-trust-400 hover:shadow-trust dark:hover:border-neon/50"
                  >
                    <h3 className="text-xs font-semibold text-trust-600 dark:text-neon">
                      {t(`${calc.i18nKey}.title` as "cha2ds2vasc.title")}
                    </h3>
                    <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">
                      {t(`${calc.i18nKey}.subtitle` as "cha2ds2vasc.subtitle")}
                    </p>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="catalog" className="space-y-6 scroll-mt-24">
        <Reveal>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {t("home.catalog_heading")}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("home.catalog_subheading")}
            </p>
          </div>
        </Reveal>
        <Reveal>
          <hr className="rule-draw neon-divider mt-4" />
        </Reveal>

        <Catalog
          calcs={calcs.map((c) => ({
            id: c.id,
            i18nKey: c.i18nKey,
            specialty: c.specialty,
          }))}
        />
      </section>

      <section className="flex flex-col gap-3 border-t border-slate-200 pt-8 text-sm text-slate-500 sm:flex-row sm:items-baseline sm:justify-between dark:border-white/10 dark:text-slate-400">
        <span>
          {t("home.doi_label")}:{" "}
          <a
            href={DOI_URL}
            className="font-mono text-trust-600 hover:underline dark:text-neon"
          >
            {DOI}
          </a>
        </span>
        <a
          href={REPO_URL}
          className="text-xs hover:text-trust-600 dark:hover:text-neon"
          target="_blank"
          rel="noreferrer"
        >
          {REPO_URL.replace("https://", "")} <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}
