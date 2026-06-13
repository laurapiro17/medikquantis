"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { hasbled } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, NumberInput } from "./Field";

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

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = hasbled.formula(inputs);
  const result = hasbled.interpret(score);

  function update<K extends keyof HasBledInput>(key: K, value: HasBledInput[K]) {
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
        <NumberInput
          className="max-w-xs"
          label={t("hasbled.fields.age")}
          value={inputs.age}
          onChange={(v) => update("age", v)}
          min={18}
          max={120}
        />

        <BooleanList
          className="border-t border-slate-200 pt-5 dark:border-white/10"
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`hasbled.fields.${field}` as "hasbled.fields.strokeHistory"),
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

      {(
        <ResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          annualRiskPercent={result.annualRiskPercent}
          riskLabelKey="common.annual_bleeding_risk"
          i18nNamespace="hasbled"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
