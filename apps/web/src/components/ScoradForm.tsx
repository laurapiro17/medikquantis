"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { scorad } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type ScoradInput = scorad.ScoradInput;
type Mode = "clinician" | "patient";

const defaultInputs: ScoradInput = {
  extentPercent: 0,
  erythema: 0,
  edemaPapules: 0,
  exudateCrusts: 0,
  excoriations: 0,
  lichenification: 0,
  dryness: 0,
  pruritus: 0,
  sleepLoss: 0,
};

const intensityFields: (keyof ScoradInput)[] = [
  "erythema",
  "edemaPapules",
  "exudateCrusts",
  "excoriations",
  "lichenification",
  "dryness",
];

export function ScoradForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<ScoradInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = scorad.formula(inputs);
  const result = scorad.interpret(score);

  function update<K extends keyof ScoradInput>(key: K, value: ScoradInput[K]) {
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
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="glass-panel space-y-6 p-6"
      >
        <fieldset className="space-y-2">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("scorad.section_a")}
          </legend>
          <NumberInput
            label={t("scorad.fields.extentPercent")}
            value={inputs.extentPercent}
            onChange={(v) => update("extentPercent", v)}
            min={0}
            max={100}
          />
        </fieldset>

        <fieldset className="space-y-2 border-t border-slate-200 pt-4 dark:border-white/10">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("scorad.section_b")}
          </legend>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("scorad.intensity_legend")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {intensityFields.map((f) => (
              <NumberInput
                key={f}
                label={t(`scorad.fields.${f}` as "scorad.fields.erythema")}
                value={inputs[f] as number}
                onChange={(v) => update(f, v as ScoradInput[typeof f])}
                min={0}
                max={3}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2 border-t border-slate-200 pt-4 dark:border-white/10">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("scorad.section_c")}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              label={t("scorad.fields.pruritus")}
              value={inputs.pruritus}
              onChange={(v) => update("pruritus", v)}
              min={0}
              max={10}
            />
            <NumberInput
              label={t("scorad.fields.sleepLoss")}
              value={inputs.sleepLoss}
              onChange={(v) => update("sleepLoss", v)}
              min={0}
              max={10}
            />
          </div>
        </fieldset>

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>
      {submitted && (
        <ResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          riskLabelKey="common.annual_risk"
          i18nNamespace="scorad"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
