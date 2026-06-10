import { getTranslations } from "next-intl/server";
import { getCalc } from "@medcalc/calculators";
import { BASE_URL } from "@/lib/site";

/**
 * Emits schema.org structured data (JSON-LD) for a calculator page.
 *
 * Models the page as a MedicalWebPage whose evidence base is the calculator's
 * original literature (each reference becomes a citation with its PubMed URL +
 * PMID), and whose mainEntity is the interactive WebApplication. This signals
 * to search engines that the page is clinician-facing, free, and grounded in
 * primary sources — the E-E-A-T signal MDCalc-style sites rely on, and a
 * prerequisite for rich results.
 *
 * Async server component: it resolves the localized name/subtitle from the
 * same translation namespace the page uses, and the references from the calc
 * registry. No data is invented (e.g. no fabricated review date).
 */
export async function CalcJsonLd({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) {
  const calc = getCalc(id);
  if (!calc) return null;

  const t = await getTranslations({ locale });
  const name = t(`${calc.i18nKey}.title`);
  const subtitle = t(`${calc.i18nKey}.subtitle`);
  const url = `${BASE_URL}/${locale}/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${name} — ${subtitle}`,
    description: subtitle,
    inLanguage: locale,
    url,
    isPartOf: { "@type": "WebSite", name: "MedikQuantis", url: BASE_URL },
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Clinician",
    },
    citation: calc.references.map((r) => ({
      "@type": "CreativeWork",
      name: r.citation,
      identifier: `PMID:${r.pmid}`,
      url: `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`,
    })),
    mainEntity: {
      "@type": "WebApplication",
      name,
      applicationCategory: "HealthApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      isAccessibleForFree: true,
    },
  };

  // Content is derived from trusted in-repo data (calc registry + translations,
  // never user input). Escaping `<` to `<` is the standard Next.js JSON-LD
  // hardening: it makes it impossible to break out of the <script> tag (e.g. a
  // stray "</script>") regardless of the source string.
  const json = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
