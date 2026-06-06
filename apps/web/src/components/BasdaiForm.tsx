"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { basdai } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type BasdaiInput = basdai.BasdaiInput;
type Mode = "clinician" | "patient";

const defaultInputs: BasdaiInput = {
  fatigue: 0,
  spineNeckHipPain: 0,
  jointPainSwelling: 0,
  tendernessOnTouch: 0,
  morningStiffnessSeverity: 0,
  morningStiffnessDuration: 0,
};

const fields: (keyof BasdaiInput)[] = [
  "fatigue",
  "spineNeckHipPain",
  "jointPainSwelling",
  "tendernessOnTouch",
  "morningStiffnessSeverity",
  "morningStiffnessDuration",
];

export function BasdaiForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<BasdaiInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = basdai.formula(inputs);
  const result = basdai.interpret(score);

  function update<K extends keyof BasdaiInput>(key: K, value: BasdaiInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t("basdai.scale_legend")}
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="glass-panel space-y-6 p-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map((f) => (
            <NumberInput
              key={f}
              label={t(`basdai.fields.${f}` as "basdai.fields.fatigue")}
              value={inputs[f]}
              onChange={(v) => update(f, v)}
              min={0}
              max={10}
            />
          ))}
        </div>
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
          i18nNamespace="basdai"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
