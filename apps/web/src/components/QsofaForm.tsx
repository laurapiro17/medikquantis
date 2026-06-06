"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { qsofa } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions } from "./Field";

type QsofaInput = qsofa.QsofaInput;
type Mode = "clinician" | "patient";

const defaultInputs: QsofaInput = {
  alteredMentalStatus: false,
  respiratoryRateAtLeast22: false,
  systolicBpAtMost100: false,
};

const booleanFields = [
  "alteredMentalStatus",
  "respiratoryRateAtLeast22",
  "systolicBpAtMost100",
] as const;

export function QsofaForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<QsofaInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const score = qsofa.formula(inputs);
  const result = qsofa.interpret(score);

  function update<K extends keyof QsofaInput>(key: K, value: QsofaInput[K]) {
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
            label: t(`qsofa.fields.${field}` as "qsofa.fields.alteredMentalStatus"),
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
          i18nNamespace="qsofa"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
