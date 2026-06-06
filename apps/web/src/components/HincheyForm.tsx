"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { hinchey } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, RadioGroup } from "./Field";

type HincheyClassValue = hinchey.HincheyClassValue;
type Mode = "clinician" | "patient";

const classes: HincheyClassValue[] = ["I", "II", "III", "IV"];

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function HincheyForm() {
  const t = useTranslations();
  const [selected, setSelected] = useState<HincheyClassValue | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    const cls = urlInputs.hincheyClass;
    if (typeof cls === "string" && (classes as string[]).includes(cls)) {
      setSelected(cls as HincheyClassValue);
      setSubmitted(true);
    }
  }, [urlInputs]);

  const result =
    selected !== null
      ? hinchey.interpret(hinchey.formula({ hincheyClass: selected }), {
          hincheyClass: selected,
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
        <RadioGroup
          name="hincheyClass"
          legend={t("hinchey.question")}
          value={selected}
          onChange={setSelected}
          layout="cards"
          options={classes.map((cls) => ({
            value: cls,
            badge: cls,
            label: t(`hinchey.classes.${cls}` as "hinchey.classes.I"),
          }))}
        />
        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
          canSubmit={!!selected}
        />
      </form>
      {submitted && result && (
        <>
          <HincheyResultPanel mode={mode} result={result} />
          <div className="glass-panel p-4">
            <ShareActions
              shareableInputs={{ hincheyClass: selected }}
              tier={result.tier}
              mode={mode}
            />
          </div>
        </>
      )}
    </div>
  );
}

function HincheyResultPanel({
  mode,
  result,
}: {
  mode: Mode;
  result: {
    classLabel: HincheyClassValue;
    tier: "low" | "moderate" | "high";
    recommendation: string;
    evidenceGrade: "A" | "B" | "C";
  };
}) {
  const t = useTranslations();
  const style = tierStyles[result.tier];

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("hinchey.result_class")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-6xl font-semibold leading-none">
            {result.classLabel}
          </span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}>
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

  const questions = t.raw("hinchey.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];
  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("hinchey.patient.intro")}</p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">
          {t(`hinchey.patient.result_${result.tier}` as "hinchey.patient.result_low")}
        </p>
        <p className="mt-1 font-mono text-sm">
          {t("hinchey.result_class")}: <strong>{result.classLabel}</strong>
        </p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("hinchey.patient.ask_doctor")}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {questionList.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </div>
      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        {t("common.disclaimer")}
      </p>
    </div>
  );
}
