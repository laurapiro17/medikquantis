"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { timi } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { BooleanList, FormActions } from "./Field";

type TimiInput = timi.TimiInput;
type Mode = "clinician" | "patient";

const defaultInputs: TimiInput = {
  ageOver65: false,
  threeOrMoreCadRiskFactors: false,
  knownCoronaryStenosis: false,
  aspirinInLast7Days: false,
  severeAnginaInLast24h: false,
  elevatedCardiacMarkers: false,
  stDeviationAtLeastHalfMm: false,
};

const booleanFields = [
  "ageOver65",
  "threeOrMoreCadRiskFactors",
  "knownCoronaryStenosis",
  "aspirinInLast7Days",
  "severeAnginaInLast24h",
  "elevatedCardiacMarkers",
  "stDeviationAtLeastHalfMm",
] as const;

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function TimiForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<TimiInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = timi.formula(inputs);
  const result = timi.interpret(score);

  function update<K extends keyof TimiInput>(key: K, value: TimiInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs(defaultInputs);
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="glass-panel space-y-6 p-6"
      >
        <BooleanList
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`timi.fields.${field}` as "timi.fields.ageOver65"),
            checked: inputs[field],
            onChange: (v) => update(field, v),
          }))}
        />

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {submitted && (
        <>
          <TimiResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          mace14d={result.annualRiskPercent}
        />
          <div className="glass-panel p-4">
            <ShareActions shareableInputs={inputs} />
          </div>
        </>
      )}
    </div>
  );
}

function TimiResultPanel(props: {
  mode: Mode;
  score: number;
  tier: "low" | "moderate" | "high";
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
  mace14d?: number;
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
          {props.mace14d !== undefined && (
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {t("timi.risk_label_14d")}
              </dt>
              <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
                {props.mace14d}%
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

  const resultKey = `timi.patient.result_${props.tier}` as const;
  const questions = t.raw("timi.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("timi.patient.intro")}</p>

      <div className={`rounded-lg px-4 py-3 ring-1 ${tierClass}`}>
        <p className="font-medium">{t(resultKey)}</p>
        {props.mace14d !== undefined && (
          <p className="mt-1 font-mono text-sm tabular-nums">
            {t("timi.risk_label_14d")}: <strong>{props.mace14d}%</strong>
          </p>
        )}
      </div>

      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("timi.patient.ask_doctor")}
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
