"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { heart } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, RadioGroup } from "./Field";

type HeartInput = heart.HeartInput;
type Mode = "clinician" | "patient";

const fields = [
  {
    key: "history" as const,
    options: ["slightly_suspicious", "moderately_suspicious", "highly_suspicious"] as const,
    badges: ["0", "+1", "+2"],
  },
  {
    key: "ecg" as const,
    options: ["normal", "non_specific_repolarization", "significant_st_depression"] as const,
    badges: ["0", "+1", "+2"],
  },
  {
    key: "age" as const,
    options: ["lt_45", "45_to_64", "gte_65"] as const,
    badges: ["0", "+1", "+2"],
  },
  {
    key: "riskFactors" as const,
    options: ["none", "1_or_2", "3_or_more_or_history"] as const,
    badges: ["0", "+1", "+2"],
  },
  {
    key: "troponin" as const,
    options: ["normal", "1_to_3x_normal", "gt_3x_normal"] as const,
    badges: ["0", "+1", "+2"],
  },
];

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function HeartForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Partial<HeartInput>>({});
  const [submitted, setSubmitted] = useState(false);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const allFilled = fields.every((f) => inputs[f.key] !== undefined);
  const result =
    allFilled
      ? heart.interpret(heart.formula(inputs as HeartInput))
      : null;
  const score = allFilled ? heart.formula(inputs as HeartInput) : null;

  function update<K extends keyof HeartInput>(key: K, value: HeartInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs({});
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (allFilled) setSubmitted(true);
        }}
        className="glass-panel space-y-6 p-6"
      >
        {fields.map((f) => (
          <RadioGroup
            key={f.key}
            name={f.key}
            legend={t(`heart.fields.${f.key}.legend` as "heart.fields.history.legend")}
            value={inputs[f.key] ?? null}
            onChange={(v) => update(f.key, v as HeartInput[typeof f.key])}
            layout="cards"
            options={f.options.map((opt, i) => ({
              value: opt,
              badge: f.badges[i],
              label: t(
                `heart.fields.${f.key}.${opt}` as "heart.fields.history.slightly_suspicious",
              ),
            }))}
          />
        ))}

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
          canSubmit={allFilled}
        />
      </form>

      {submitted && result !== null && score !== null && (
        <>
          <HeartResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          mace6w={result.annualRiskPercent}
        />
          <div className="glass-panel p-4">
            <ShareActions shareableInputs={inputs as Record<string, unknown>} />
          </div>
        </>
      )}
    </div>
  );
}

function HeartResultPanel(props: {
  mode: Mode;
  score: number;
  tier: "low" | "moderate" | "high";
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
  mace6w?: number;
}) {
  const t = useTranslations();
  const tierClass = tierStyles[props.tier];

  if (props.mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("common.score")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-6xl font-semibold leading-none tabular-nums">
            {props.score}
          </span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${tierClass}`}>
            {t(`common.tier_${props.tier}` as "common.tier_low")}
          </span>
        </div>

        <p className="mt-5 text-slate-900 dark:text-slate-100">{props.recommendation}</p>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          {props.mace6w !== undefined && (
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t("heart.risk_label_6w")}
              </dt>
              <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
                {props.mace6w}%
              </dd>
            </div>
          )}
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("common.evidence")}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {props.evidenceGrade}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  // Patient mode
  const resultKey = `heart.patient.result_${props.tier}` as const;
  const questions = t.raw("heart.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("heart.patient.intro")}</p>

      <div className={`rounded-lg px-4 py-3 ring-1 ${tierClass}`}>
        <p className="font-medium">{t(resultKey)}</p>
        {props.mace6w !== undefined && (
          <p className="mt-1 font-mono text-sm tabular-nums">
            {t("heart.risk_label_6w")}: <strong>{props.mace6w}%</strong>
          </p>
        )}
      </div>

      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("heart.patient.ask_doctor")}
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
    </div>
  );
}
