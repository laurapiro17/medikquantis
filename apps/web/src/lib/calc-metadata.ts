import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCalc } from "@medcalc/calculators";
import { routing } from "@/i18n/routing";
import { BASE_URL } from "@/lib/site";

/**
 * Locale-specific suffix appended to the meta description so each page carries
 * the relevant search keyword ("calculadora" / "calculator") instead of just
 * the bare clinical subtitle.
 */
const DESCRIPTION_SUFFIX: Record<string, string> = {
  ca: "Calculadora clínica en línia: fórmula, interpretació i referències (PMID).",
  es: "Calculadora clínica en línea: fórmula, interpretación y referencias (PMID).",
  en: "Free online clinical calculator: formula, interpretation and references (PMID).",
};

/**
 * Locale-specific title pattern. The page <title> is the single strongest
 * on-page ranking signal, so it must carry the term people actually search:
 * "calculadora {score}" in CA/ES, "{score} calculator" in EN. The previous
 * title was just "{name} — {subtitle}", which never matched those queries.
 */
const TITLE_PATTERN: Record<string, (name: string, subtitle: string) => string> = {
  ca: (name, subtitle) => `Calculadora ${name} — ${subtitle}`,
  es: (name, subtitle) => `Calculadora ${name} — ${subtitle}`,
  en: (name, subtitle) => `${name} Calculator — ${subtitle}`,
};

/**
 * Builds per-calculator SEO metadata: a unique, keyword-bearing title, a unique
 * description, a SELF-referential canonical (the page's own localized URL), and
 * hreflang alternates for every supported locale plus x-default.
 *
 * Without this, calculator pages inherit the layout's metadata — a generic
 * "MedikQuantis" title and a canonical pointing at the homepage — which tells
 * Google every calculator is a duplicate of the homepage.
 *
 * The title is returned WITHOUT a site-name suffix: the layout's
 * `title.template` ("%s · MedikQuantis") appends it.
 */
export async function buildCalcMetadata(
  id: string,
  paramsPromise: Promise<{ locale: string }>,
): Promise<Metadata> {
  const { locale } = await paramsPromise;
  const calc = getCalc(id);
  if (!calc) return {};

  const t = await getTranslations({ locale });
  const name = t(`${calc.i18nKey}.title`);
  const subtitle = t(`${calc.i18nKey}.subtitle`);

  const makeTitle = TITLE_PATTERN[locale] ?? TITLE_PATTERN.en;
  const title = makeTitle(name, subtitle);
  const suffix = DESCRIPTION_SUFFIX[locale] ?? DESCRIPTION_SUFFIX.en;
  const description = `${subtitle}. ${suffix}`;

  const path = (l: string) => `${BASE_URL}/${l}/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: path(locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, path(l)])),
        "x-default": path(routing.defaultLocale),
      },
    },
    openGraph: {
      title,
      description,
      url: path(locale),
      siteName: "MedikQuantis",
      type: "article",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
