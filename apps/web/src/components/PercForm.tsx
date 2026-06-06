"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { perc } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions } from "./Field";

type PercInput = perc.PercInput;
type Mode = "clinician" | "patient";

const defaultInputs: PercInput = {
  ageOver50: false,
  heartRateOver100: false,
  oxygenSaturationBelow95: false,
  hemoptysis: false,
  estrogenUse: false,
  previousDvtOrPe: false,
  unilateralLegSwelling: false,
  recentSurgeryOrTrauma: false,
};

const booleanFields = [
  "ageOver50",
  "heartRateOver100",
  "oxygenSaturationBelow95",
  "hemoptysis",
  "estrogenUse",
  "previousDvtOrPe",
  "unilateralLegSwelling",
  "recentSurgeryOrTrauma",
] as const;

export function PercForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<PercInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const score = perc.formula(inputs);
  const result = perc.interpret(score);

  function update<K extends keyof PercInput>(key: K, value: PercInput[K]) {
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
            label: t(`perc.fields.${field}` as "perc.fields.hemoptysis"),
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
          riskLabelKey="common.annual_risk"
          i18nNamespace="perc"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
