import { getTranslations } from "next-intl/server";
import { REVIEWER } from "@/lib/reviewer";

/**
 * Visible E-E-A-T byline rendered (server-side) on every calculator page.
 *
 * States, honestly, who reviewed the content and when, links the reviewer's
 * ORCID, and makes explicit that the clinical authority for each score is its
 * original authors (see the page's References). This is the human-readable
 * counterpart to the author/reviewedBy/lastReviewed fields in CalcJsonLd.
 *
 * Identity is centralized in lib/reviewer.ts; the labels are localized.
 */
export async function CalcByline({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  return (
    <section
      aria-label={t("common.reviewed_by")}
      className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-xs leading-relaxed text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
    >
      <p>
        {t("common.reviewed_by")}:{" "}
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {REVIEWER.name}
        </span>{" "}
        — {t("common.reviewer_role")} ·{" "}
        <a
          href={REVIEWER.orcidUrl}
          target="_blank"
          rel="noreferrer"
          className="text-trust-600 underline dark:text-neon"
        >
          ORCID {REVIEWER.orcidId}
        </a>
      </p>
      <p className="mt-1">{t("common.scores_attribution")}</p>
      <p className="mt-1">
        {t("common.last_reviewed")}: {t("common.last_reviewed_value")}
      </p>
    </section>
  );
}
