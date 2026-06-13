"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { calciumCorrected } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, NumberInput } from "./Field";
import { useUrlInputs } from "./useUrlInputs";

type CalciumCorrectedInput = calciumCorrected.CalciumCorrectedInput;
type Mode = "clinician" | "patient";

const defaultInputs: CalciumCorrectedInput = {
  calciumMgDl: 9.0,
  albuminGDl: 4.0,
};

const categoryStyles = {
  hypocalcaemia:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  normal:
    "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  hypercalcaemia:
    "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function CalciumCorrectedForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<CalciumCorrectedInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const corrected = calciumCorrected.formula(inputs);
  const result = calciumCorrected.interpret(corrected);

  function update<K extends keyof CalciumCorrectedInput>(
    key: K,
    value: CalciumCorrectedInput[K],
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs(defaultInputs);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="glass-panel space-y-6 p-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput
            label={t("calciumCorrected.fields.calciumMgDl")}
            value={inputs.calciumMgDl}
            onChange={(v) => update("calciumMgDl", v)}
            min={2}
            max={20}
          />
          <NumberInput
            label={t("calciumCorrected.fields.albuminGDl")}
            value={inputs.albuminGDl}
            onChange={(v) => update("albuminGDl", v)}
            min={0.5}
            max={8}
          />
        </div>

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {(
        <>
          <CalciumResultPanel
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

function CalciumResultPanel({
  mode,
  corrected,
  category,
  recommendation,
  evidenceGrade,
}: {
  mode: Mode;
  corrected: number;
  category: "hypocalcaemia" | "normal" | "hypercalcaemia";
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
            {t("calciumCorrected.result_label")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-5xl font-semibold leading-none tabular-nums">
            {corrected.toFixed(2)}
          </span>
          <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
            mg/dL
          </span>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}
          >
            {t(`calciumCorrected.categories.${category}` as
              "calciumCorrected.categories.normal")}
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

  // Patient mode
  const resultKey = `calciumCorrected.patient.result_${category}` as const;
  const questions = t.raw("calciumCorrected.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">
        {t("calciumCorrected.patient.intro")}
      </p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">{t(resultKey)}</p>
        <p className="mt-1 font-mono text-sm">
          {t("calciumCorrected.result_label")}:{" "}
          <strong>{corrected.toFixed(2)} mg/dL</strong>
        </p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("calciumCorrected.patient.ask_doctor")}
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
