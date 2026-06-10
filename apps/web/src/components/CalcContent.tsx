import { getTranslations } from "next-intl/server";
import { getCalc } from "@medcalc/calculators";

type Faq = { q: string; a: string };

type Headings = {
  overview: string;
  interpretation: string;
  cautions: string;
  faq: string;
};

const EN_HEADINGS: Headings = {
  overview: "What it is and when to use it",
  interpretation: "How to interpret it",
  cautions: "Limitations and when not to use it",
  faq: "Frequently asked questions",
};

const HEADINGS: Record<string, Headings> = {
  ca: {
    overview: "Què és i quan s'utilitza",
    interpretation: "Com s'interpreta",
    cautions: "Limitacions i quan no usar-lo",
    faq: "Preguntes freqüents",
  },
  es: {
    overview: "Qué es y cuándo se utiliza",
    interpretation: "Cómo se interpreta",
    cautions: "Limitaciones y cuándo no usarlo",
    faq: "Preguntas frecuentes",
  },
  en: EN_HEADINGS,
};

/**
 * Long-form, SEO-oriented clinical content rendered below the calculator:
 * overview, interpretation, limitations and an FAQ. Content lives in the i18n
 * messages under `${i18nKey}.content`; this component renders nothing when a
 * calculator has no content block yet, so it is safe to mount on every page
 * while content is filled in incrementally.
 *
 * When an FAQ is present it also emits FAQPage structured data.
 */
export async function CalcContent({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) {
  const calc = getCalc(id);
  if (!calc) return null;

  const t = await getTranslations({ locale });
  const base = `${calc.i18nKey}.content`;
  if (!t.has(`${base}.overview`)) return null;

  const H = HEADINGS[locale] ?? EN_HEADINGS;

  const interpretation = t.has(`${base}.interpretation`)
    ? t(`${base}.interpretation`)
    : null;
  const cautions = t.has(`${base}.cautions`) ? t(`${base}.cautions`) : null;
  const faq: Faq[] = t.has(`${base}.faq`)
    ? (t.raw(`${base}.faq`) as Faq[])
    : [];

  const faqJsonLd =
    faq.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }).replace(/</g, "\\u003c")
      : null;

  return (
    <section className="glass-panel space-y-6 p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {H.overview}
        </h2>
        <p>{t(`${base}.overview`)}</p>
      </div>

      {interpretation && (
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {H.interpretation}
          </h2>
          <p>{interpretation}</p>
        </div>
      )}

      {cautions && (
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {H.cautions}
          </h2>
          <p>{cautions}</p>
        </div>
      )}

      {faq.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {H.faq}
          </h2>
          <dl className="space-y-3">
            {faq.map((f, i) => (
              <div key={i}>
                <dt className="font-medium text-slate-800 dark:text-slate-200">
                  {f.q}
                </dt>
                <dd className="mt-1">{f.a}</dd>
              </div>
            ))}
          </dl>
          {faqJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: faqJsonLd }}
            />
          )}
        </div>
      )}
    </section>
  );
}
