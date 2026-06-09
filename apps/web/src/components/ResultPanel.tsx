"use client";

import { useTranslations } from "next-intl";
import { ShareActions } from "./ShareActions";

type Mode = "clinician" | "patient";
type Tier = "low" | "moderate" | "high";

const tierStyles: Record<Tier, string> = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
};

interface ResultPanelProps {
  mode: Mode;
  score: number;
  tier: Tier;
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
  annualRiskPercent?: number;
  riskLabelKey: "common.annual_risk" | "common.annual_bleeding_risk";
  i18nNamespace: string;
  shareableInputs?: Record<string, unknown>;
}

export function ResultPanel({
  mode,
  score,
  tier,
  recommendation,
  evidenceGrade,
  annualRiskPercent,
  riskLabelKey,
  i18nNamespace,
  shareableInputs,
}: ResultPanelProps) {
  const t = useTranslations();

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("common.score")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-6xl font-semibold leading-none tabular-nums">
            {score}
          </span>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${tierStyles[tier]}`}
          >
            {t(`common.tier_${tier}` as "common.tier_low")}
          </span>
        </div>

        <p className="mt-5 text-slate-900 dark:text-slate-100">{recommendation}</p>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          {annualRiskPercent !== undefined && (
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t(riskLabelKey)}
              </dt>
              <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
                {annualRiskPercent}%
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

        <ShareActions shareableInputs={shareableInputs} tier={tier} mode={mode} />
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
    <div className="glass-panel animate-fade-in space-y-5 p-6">
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
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-white/15 dark:bg-white/5">
      {(["clinician", "patient"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={
            mode === m
              ? "rounded-full bg-trust-600 px-4 py-1.5 text-sm font-medium text-white dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft"
              : "rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-neon"
          }
        >
          {t(`common.mode_${m}` as "common.mode_clinician")}
        </button>
      ))}
    </div>
  );
}
