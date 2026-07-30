"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ShareActions } from "./ShareActions";
import { CountUp } from "./CountUp";

type Mode = "clinician" | "patient";
type Tier = "low" | "moderate" | "high";

const tierStyles: Record<Tier, string> = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
};

const tierText: Record<Tier, string> = {
  low: "text-emerald-600 dark:text-emerald-400",
  moderate: "text-amber-600 dark:text-amber-400",
  high: "text-cardio-600 dark:text-cardio-500",
};

const tierBar: Record<Tier, string> = {
  low: "bg-emerald-500",
  moderate: "bg-amber-500",
  high: "bg-cardio-600",
};

interface ResultPanelProps {
  mode: Mode;
  score: number;
  tier: Tier;
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
  annualRiskPercent?: number;
  riskLabelKey?: "common.annual_risk" | "common.annual_bleeding_risk" | (string & {});
  unit?: string;
  i18nNamespace: string;
  shareableInputs?: Record<string, unknown>;
  scoreRange?: { min: number; max: number };
}

function RiskSpectrumMeter({
  score,
  tier,
  scoreRange,
}: {
  score: number;
  tier: Tier;
  scoreRange?: { min: number; max: number };
}) {
  const t = useTranslations();
  const min = scoreRange?.min ?? 0;
  const max = scoreRange?.max ?? (tier === "low" ? 3 : tier === "moderate" ? 6 : 10);

  const percentage = Math.min(
    96,
    Math.max(4, Math.round(((score - min) / (max - min || 1)) * 100))
  );

  return (
    <div className="mt-4 space-y-2">
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200/80 p-0.5 shadow-inner dark:bg-white/10">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 opacity-90 dark:from-emerald-400 dark:via-amber-400 dark:to-rose-500" />
        <div
          className="absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full bg-white border-2 border-slate-900 shadow-md transition-all duration-700 ease-out dark:bg-slate-950 dark:border-white"
          style={{ left: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span className={tier === "low" ? "font-bold text-emerald-600 dark:text-emerald-400" : ""}>
          {t("common.tier_low")}
        </span>
        <span className={tier === "moderate" ? "font-bold text-amber-600 dark:text-amber-400" : ""}>
          {t("common.tier_moderate")}
        </span>
        <span className={tier === "high" ? "font-bold text-cardio-600 dark:text-cardio-500" : ""}>
          {t("common.tier_high")}
        </span>
      </div>
    </div>
  );
}

export function ResultPanel({
  mode,
  score,
  tier,
  recommendation,
  evidenceGrade,
  annualRiskPercent,
  riskLabelKey = "common.annual_risk",
  unit,
  i18nNamespace,
  shareableInputs,
  scoreRange,
}: ResultPanelProps) {
  const t = useTranslations();
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setLit(true));
    return () => cancelAnimationFrame(id);
  }, [score]);

  if (mode === "clinician") {
    const activeCriteria: string[] = [];
    if (shareableInputs) {
      Object.entries(shareableInputs).forEach(([key, val]) => {
        if (val === true) {
          try {
            activeCriteria.push(t(`${i18nNamespace}.fields.${key}`));
          } catch {
            activeCriteria.push(key);
          }
        } else if (typeof val === "number" || (typeof val === "string" && val.length > 0)) {
          try {
            const fieldLabel = t(`${i18nNamespace}.fields.${key}`);
            const valDisplay =
              typeof val === "string" && t.has(`${i18nNamespace}.fields.${key}_${val}`)
                ? t(`${i18nNamespace}.fields.${key}_${val}`)
                : typeof val === "string" && t.has(`common.${val}`)
                ? t(`common.${val}`)
                : String(val);
            activeCriteria.push(`${fieldLabel}: ${valDisplay}`);
          } catch {
            activeCriteria.push(`${key}: ${val}`);
          }
        }
      });
    }

    const titleKey = `${i18nNamespace}.title`;
    const resultSummary = [
      `[${t(titleKey)}]`,
      `${t("common.score")}: ${score} (${t(`common.tier_${tier}` as "common.tier_low")})`,
      ...(activeCriteria.length > 0 ? [`Criterios: ${activeCriteria.join("; ")}`] : []),
      ...(annualRiskPercent !== undefined
        ? [`${t(riskLabelKey)}: ${annualRiskPercent}%`]
        : []),
      `Recomendación: ${recommendation}`,
      `${t("common.evidence")}: ${evidenceGrade}`,
    ].join("\n");

    return (
      <div key={score} role="status" aria-live="polite" aria-atomic="true" aria-label={t("common.result")} className="glass-panel animate-result p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("common.score")}
          </span>
          <CountUp
            value={score}
            className={`inline-block animate-score font-mono text-6xl sm:text-7xl font-semibold leading-none tabular-nums ${tierText[tier]}`}
          />
          <span
            className={`animate-badge ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${tierStyles[tier]}`}
          >
            {t(`common.tier_${tier}` as "common.tier_low")}
          </span>
        </div>

        <RiskSpectrumMeter score={score} tier={tier} scoreRange={scoreRange} />

        <p className="mt-5 text-slate-900 dark:text-slate-100">{recommendation}</p>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          {annualRiskPercent !== undefined && (
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t(riskLabelKey)}
              </dt>
              <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
                <CountUp
                  value={annualRiskPercent}
                  decimals={Number.isInteger(annualRiskPercent) ? 0 : 1}
                  className="font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100"
                />%
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("common.evidence")}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {evidenceGrade}
            </dd>
          </div>
        </dl>

        <ShareActions
          shareableInputs={shareableInputs}
          tier={tier}
          mode={mode}
          resultSummary={resultSummary}
        />
      </div>
    );
  }

  // Patient mode
  const resultKey = `${i18nNamespace}.patient.result_${tier}`;
  const introKey = `${i18nNamespace}.patient.intro`;
  const askDoctorKey = `${i18nNamespace}.patient.ask_doctor`;
  const questionsKey = `${i18nNamespace}.patient.questions`;
  const questions = t.raw(questionsKey);
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div key={score} role="status" aria-live="polite" aria-atomic="true" aria-label={t("common.result")} className="glass-panel animate-result space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t(introKey)}</p>

      <div className={`rounded-lg px-4 py-3 ring-1 ${tierStyles[tier]}`}>
        <p className="font-medium">{t(resultKey)}</p>
        {annualRiskPercent !== undefined && (
          <p className="mt-1 font-mono text-sm tabular-nums">
            {t(riskLabelKey)}: <strong>{annualRiskPercent}%</strong>
          </p>
        )}
      </div>

      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t(askDoctorKey)}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {questionList.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>

      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        {t("common.disclaimer")}
      </p>

      <ShareActions shareableInputs={shareableInputs} tier={tier} mode={mode} />
    </div>
  );
}

export function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  const t = useTranslations();
  return (
    <div>
      <div
        role="radiogroup"
        aria-label={t("common.view_mode")}
        className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-white/15 dark:bg-white/5"
      >
        {(["clinician", "patient"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => onChange(m)}
            className={
              mode === m
                ? "press rounded-full bg-trust-600 px-4 py-1.5 text-sm font-medium text-white dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft"
                : "press rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-neon"
            }
          >
            {t(`common.mode_${m}` as "common.mode_clinician")}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t("common.mode_hint")}</p>
    </div>
  );
}
