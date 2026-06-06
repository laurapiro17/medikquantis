import { setRequestLocale, getTranslations } from "next-intl/server";
import { listCalcs } from "@medcalc/calculators";
import { Link } from "@/i18n/navigation";
import { Catalog } from "@/components/Catalog";

const DOI = "10.5281/zenodo.20562618";
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
    softwareVersion: "1.0.0",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    inLanguage: ["ca", "es", "en"],
    author: {
      "@type": "Person",
      name: "Laura Piñero Roig",
      affiliation: {
        "@type": "EducationalOrganization",
        name: "School of Medicine, University of Barcelona",
      },
      identifier: "https://orcid.org/0009-0008-3390-4029",
    },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "DOI",
      value: DOI,
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <section className="space-y-6">
        <p className="font-mono text-xs uppercase tracking-widest text-trust-600 dark:text-neon/80">
          {t("home.hero_eyebrow")}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
          {t("home.hero_heading")}
        </h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          {t("home.hero_subheading")}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="#catalog"
            className="rounded-md bg-trust-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-trust-700 dark:bg-neon dark:text-[#0c0f10] dark:hover:bg-[#5cf5ff]"
          >
            {t("home.hero_cta_calcs")}
          </Link>
          <a
            href="/api/v1/docs"
            className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-trust-500 hover:text-trust-700 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-neon/50 dark:hover:text-neon"
          >
            {t("home.hero_cta_api")} →
          </a>
        </div>
      </section>

      <section
        aria-label="Value propositions"
        className="grid gap-4 sm:grid-cols-3"
      >
        {[1, 2, 3].map((n) => (
          <div key={n} className="glass-panel space-y-2 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {t(`home.value_${n}_title` as "home.value_1_title")}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t(`home.value_${n}_body` as "home.value_1_body")}
            </p>
          </div>
        ))}
      </section>

      <section
        id="api"
        className="glass-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1">
          <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-neon/80">
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
      </section>

      <section id="catalog" className="space-y-6 scroll-mt-24">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {t("home.catalog_heading")}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("home.catalog_subheading")}
          </p>
        </div>

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
          {REPO_URL.replace("https://", "")} ↗
        </a>
      </section>
    </div>
  );
}
