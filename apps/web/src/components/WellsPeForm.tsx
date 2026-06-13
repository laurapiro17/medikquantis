"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { wellsPe } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions } from "./Field";

type WellsPeInput = wellsPe.WellsPeInput;
type Mode = "clinician" | "patient";

const defaultInputs: WellsPeInput = {
  clinicalSignsOfDvt: false,
  peAsLikelyAsAlternative: false,
  heartRateOver100: false,
  immobilizationOrSurgeryLast4Weeks: false,
  previousDvtOrPe: false,
  hemoptysis: false,
  activeOrTreatedMalignancy: false,
};

const booleanFields = [
  "clinicalSignsOfDvt",
  "peAsLikelyAsAlternative",
  "heartRateOver100",
  "immobilizationOrSurgeryLast4Weeks",
  "previousDvtOrPe",
  "hemoptysis",
  "activeOrTreatedMalignancy",
] as const;

export function WellsPeForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<WellsPeInput>(defaultInputs);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = wellsPe.formula(inputs);
  const result = wellsPe.interpret(score);

  function update<K extends keyof WellsPeInput>(key: K, value: WellsPeInput[K]) {
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
        <BooleanList
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`wellsPe.fields.${field}` as "wellsPe.fields.hemoptysis"),
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
          riskLabelKey="common.annual_risk"
          i18nNamespace="wellsPe"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
