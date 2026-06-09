"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { sodiumCorrected } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, NumberInput } from "./Field";
import { useUrlInputs } from "./useUrlInputs";

type SodiumCorrectedInput = sodiumCorrected.SodiumCorrectedInput;
type Mode = "clinician" | "patient";

const defaultInputs: SodiumCorrectedInput = {
  sodiumMEqL: 138,
  glucoseMgDl: 100,
};

const categoryStyles = {
  hyponatraemia:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  normal:
    "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  hypernatraemia:
    "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function SodiumCorrectedForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<SodiumCorrectedInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const corrected = sodiumCorrected.formula(inputs);
  const result = sodiumCorrected.interpret(corrected);

  function update<K extends keyof SodiumCorrectedInput>(
    key: K,
    value: SodiumCorrectedInput[K],
  ) {
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
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput
            label={t("sodiumCorrected.fields.sodiumMEqL")}
            value={inputs.sodiumMEqL}
            onChange={(v) => update("sodiumMEqL", v)}
            min={100}
            max={180}
          />
          <NumberInput
            label={t("sodiumCorrected.fields.glucoseMgDl")}
            value={inputs.glucoseMgDl}
            onChange={(v) => update("glucoseMgDl", v)}
            min={50}
            max={2000}
          />
        </div>

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {submitted && (
        <>
          <SodiumResultPanel
            mode={mode}
            corrected={corrected}
            category={result.category}
            recommendation={result.recommendation}
            evidenceGrade={result.evidenceGrade}
          />
          <div className="glass-panel p-4">
            <ShareActions
              shareableInputs={inputs}
              tier={result.tier}
              mode={mode}
            />
          </div>
        </>
      )}
    </div>
  );
}

function SodiumResultPanel({
  mode,
  corrected,
  category,
  recommendation,
  evidenceGrade,
}: {
  mode: Mode;
  corrected: number;
  category: "hyponatraemia" | "normal" | "hypernatraemia";
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
}) {
  const t = useTranslations();
  const style = categoryStyles[category];

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("sodiumCorrected.result_label")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-5xl font-semibold leading-none tabular-nums">
            {corrected.toFixed(1)}
          </span>
          <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
            mEq/L
          </span>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}
          >
            {t(`sodiumCorrected.categories.${category}` as
              "sodiumCorrected.categories.normal")}
          </span>
        </div>

        <p className="mt-5 text-slate-900 dark:text-slate-100">{recommendation}</p>

        <dl className="mt-5 grid gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("common.evidence")}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 dark:text-slate-100">
              {evidenceGrade}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  const resultKey = `sodiumCorrected.patient.result_${category}` as const;
  const questions = t.raw("sodiumCorrected.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">
        {t("sodiumCorrected.patient.intro")}
      </p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">{t(resultKey)}</p>
        <p className="mt-1 font-mono text-sm">
          {t("sodiumCorrected.result_label")}:{" "}
          <strong>{corrected.toFixed(1)} mEq/L</strong>
        </p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("sodiumCorrected.patient.ask_doctor")}
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
