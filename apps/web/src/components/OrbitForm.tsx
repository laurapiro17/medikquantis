"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { orbit } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, NumberInput } from "./Field";

type OrbitInput = orbit.OrbitInput;
type Mode = "clinician" | "patient";

const defaultInputs: OrbitInput = {
  age: 65,
  reducedHemoglobinOrHematocrit: false,
  bleedingHistory: false,
  reducedRenalFunction: false,
  antiplateletTreatment: false,
};

const booleanFields = [
  "reducedHemoglobinOrHematocrit",
  "bleedingHistory",
  "reducedRenalFunction",
  "antiplateletTreatment",
] as const;

export function OrbitForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<OrbitInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const score = orbit.formula(inputs);
  const result = orbit.interpret(score);

  function update<K extends keyof OrbitInput>(key: K, value: OrbitInput[K]) {
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
        <NumberInput
          className="max-w-xs"
          label={t("orbit.fields.age")}
          value={inputs.age}
          onChange={(v) => update("age", v)}
          min={18}
          max={120}
        />

        <BooleanList
          className="border-t border-slate-200 pt-5 dark:border-white/10"
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`orbit.fields.${field}` as "orbit.fields.bleedingHistory"),
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
        <ResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          annualRiskPercent={result.annualRiskPercent}
          riskLabelKey="common.annual_bleeding_risk"
          i18nNamespace="orbit"
        />
      )}
    </div>
  );
}
