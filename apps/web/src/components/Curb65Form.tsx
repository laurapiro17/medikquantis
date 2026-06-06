"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { curb65 } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions } from "./Field";

type Curb65Input = curb65.Curb65Input;
type Mode = "clinician" | "patient";

const defaultInputs: Curb65Input = {
  confusion: false,
  ureaOver7: false,
  respiratoryRateAtLeast30: false,
  lowBloodPressure: false,
  ageAtLeast65: false,
};

const booleanFields = [
  "confusion",
  "ureaOver7",
  "respiratoryRateAtLeast30",
  "lowBloodPressure",
  "ageAtLeast65",
] as const;

export function Curb65Form() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Curb65Input>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = curb65.formula(inputs);
  const result = curb65.interpret(score);

  function update<K extends keyof Curb65Input>(key: K, value: Curb65Input[K]) {
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
            label: t(`curb65.fields.${field}` as "curb65.fields.confusion"),
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
          i18nNamespace="curb65"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
