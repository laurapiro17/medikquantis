"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ehra } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";

type EhraClassValue = ehra.EhraClassValue;
type Mode = "clinician" | "patient";

const classes: EhraClassValue[] = ["I", "IIa", "IIb", "III", "IV"];

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function EhraForm() {
  const t = useTranslations();
  const [selected, setSelected] = useState<EhraClassValue | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const result =
    selected !== null
      ? ehra.interpret(ehra.formula({ ehraClass: selected }), {
          ehraClass: selected,
        })
      : null;

  function reset() {
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (selected) setSubmitted(true);
        }}
        className="glass-panel space-y-6 p-6"
      >
        <fieldset className="space-y-3">
          <legend className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("ehra.question")}
          </legend>
          {classes.map((cls) => (
            <label
              key={cls}
              className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition ${
                selected === cls
                  ? "border-trust-600 bg-trust-50 dark:border-neon dark:bg-neon/5"
                  : "border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
              }`}
            >
              <input
                type="radio"
                name="ehraClass"
                value={cls}
                checked={selected === cls}
                onChange={() => setSelected(cls)}
                className="mt-0.5 h-4 w-4 border-slate-300 text-trust-600 focus:ring-trust-600 dark:border-white/20 dark:bg-white/5 dark:text-neon dark:focus:ring-neon"
              />
              <span className="flex-1 text-slate-700 dark:text-slate-300">
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {cls}
                </span>
                <span className="ml-2">{t(`ehra.classes.${cls}` as "ehra.classes.I")}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="flex gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
          <button
            type="submit"
            disabled={!selected}
            className="rounded-md bg-trust-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-trust-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft dark:hover:bg-neon-soft"
          >
            {t("common.calculate")}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
          >
            {t("common.reset")}
          </button>
        </div>
      </form>

      {submitted && result && (
        <EhraResultPanel mode={mode} result={result} />
      )}
    </div>
  );
}

function EhraResultPanel({
  mode,
  result,
}: {
  mode: Mode;
  result: {
    classLabel: EhraClassValue;
    tier: "low" | "moderate" | "high";
    recommendation: string;
    evidenceGrade: "A" | "B" | "C";
  };
}) {
  const t = useTranslations();
  const tierClass = tierStyles[result.tier];

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("ehra.result_class")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-6xl font-semibold leading-none">
            {result.classLabel}
          </span>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${tierClass}`}
          >
            {t(`common.tier_${result.tier}` as "common.tier_low")}
          </span>
        </div>

        <p className="mt-5 text-slate-900 dark:text-slate-100">{result.recommendation}</p>

        <dl className="mt-5 grid gap-4 text-sm">
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("common.evidence")}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 dark:text-slate-100">
              {result.evidenceGrade}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  // Patient mode
  const resultKey = `ehra.patient.result_${result.tier}` as const;
  const questions = t.raw("ehra.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("ehra.patient.intro")}</p>

      <div className={`rounded-lg px-4 py-3 ring-1 ${tierClass}`}>
        <p className="font-medium">{t(resultKey)}</p>
        <p className="mt-1 font-mono text-sm">
          {t("ehra.result_class")}: <strong>{result.classLabel}</strong>
        </p>
      </div>

      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("ehra.patient.ask_doctor")}
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
