"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { hasbled } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";

type HasBledInput = hasbled.HasBledInput;
type Mode = "clinician" | "patient";

const defaultInputs: HasBledInput = {
  age: 65,
  uncontrolledHypertension: false,
  abnormalRenalFunction: false,
  abnormalLiverFunction: false,
  strokeHistory: false,
  bleedingHistoryOrPredisposition: false,
  labileInr: false,
  drugsPredisposingToBleeding: false,
  alcoholExcess: false,
};

const booleanFields = [
  "uncontrolledHypertension",
  "abnormalRenalFunction",
  "abnormalLiverFunction",
  "strokeHistory",
  "bleedingHistoryOrPredisposition",
  "labileInr",
  "drugsPredisposingToBleeding",
  "alcoholExcess",
] as const;

export function HasBledForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<HasBledInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const score = hasbled.formula(inputs);
  const result = hasbled.interpret(score);

  function update<K extends keyof HasBledInput>(key: K, value: HasBledInput[K]) {
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
        <label className="block max-w-xs">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("hasbled.fields.age")}
          </span>
          <input
            type="number"
            min={18}
            max={120}
            value={inputs.age}
            onChange={(e) => update("age", Number(e.target.value))}
            className="input-underline mt-1 font-mono tabular-nums"
          />
        </label>

        <div className="space-y-2.5 border-t border-slate-200 pt-5 dark:border-white/10">
          {booleanFields.map((field) => (
            <label key={field} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={inputs[field]}
                onChange={(e) => update(field, e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-trust-600 focus:ring-trust-600 dark:border-white/20 dark:bg-white/5 dark:text-neon dark:focus:ring-neon"
              />
              <span>{t(`hasbled.fields.${field}` as "hasbled.fields.strokeHistory")}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
          <button
            type="submit"
            className="rounded-md bg-trust-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-trust-700 dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft dark:hover:bg-neon-soft"
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

      {submitted && (
        <ResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          annualRiskPercent={result.annualRiskPercent}
          riskLabelKey="common.annual_bleeding_risk"
          i18nNamespace="hasbled"
        />
      )}
    </div>
  );
}
