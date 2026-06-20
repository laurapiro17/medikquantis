import { setRequestLocale, getTranslations } from "next-intl/server";
import { Cha2ds2vascForm } from "@/components/Cha2ds2vascForm";
import { HasBledForm } from "@/components/HasBledForm";
import { buildPageMetadata } from "@/lib/page-metadata";
import { BASE_URL } from "@/lib/site";
import { REVIEWER } from "@/lib/reviewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildPageMetadata({
    pathSegment: "compare",
    locale,
    title: t("compare.subtitle"),
    description: t("compare.intro"),
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // MedicalWebPage JSON-LD for the decision page: grounds it in the ESC 2024
  // guideline. Authorship is attributed to the project (not a named person).
  const publisher = {
    "@type": "Organization",
    name: "MedikQuantis",
    url: BASE_URL,
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t("compare.subtitle"),
    description: t("compare.intro"),
    inLanguage: locale,
    url: `${BASE_URL}/${locale}/compare`,
    isPartOf: { "@type": "WebSite", name: "MedikQuantis", url: BASE_URL },
    medicalAudience: { "@type": "MedicalAudience", audienceType: "Clinician" },
    author: publisher,
    lastReviewed: REVIEWER.lastReviewedIso,
    citation: {
      "@type": "CreativeWork",
      name: "2024 ESC Guidelines for the management of atrial fibrillation",
      identifier: "PMID:39210723",
      url: "https://pubmed.ncbi.nlm.nih.gov/39210723/",
    },
  };
  const json = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
      <div className="space-y-3">
        <p className="text-xs font-medium text-trust-600 dark:text-neon/80">
          {t("compare.title")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          {t("compare.subtitle")}
        </h1>
        <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {t("compare.intro")}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("compare.stroke_heading")}
          </h2>
          <Cha2ds2vascForm />
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("compare.bleeding_heading")}
          </h2>
          <HasBledForm />
        </section>
      </div>

      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        {t("compare.footer_note")}
      </p>
    </div>
  );
}
