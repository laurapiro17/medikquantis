import { getTranslations } from "next-intl/server";

/**
 * Visible provenance byline rendered (server-side) on every calculator page.
 *
 * States, honestly, that the content is clinically reviewed and when, and makes
 * explicit that the clinical authority for each score is its original authors
 * (see the page's References). The named reviewer is intentionally omitted from
 * the public byline for now; the structured-data counterpart in CalcJsonLd
 * attributes authorship to the MedikQuantis project.
 */
export async function CalcByline({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  return (
    <section
      aria-label={t("common.reviewed_by")}
      className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-xs leading-relaxed text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
    >
      <p>{t("common.scores_attribution")}</p>
      <p className="mt-1">
        {t("common.last_reviewed")}: {t("common.last_reviewed_value")}
      </p>
    </section>
  );
}
