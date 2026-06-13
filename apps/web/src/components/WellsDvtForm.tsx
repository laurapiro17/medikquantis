"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { wellsDvt } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions } from "./Field";

type WellsDvtInput = wellsDvt.WellsDvtInput;
type Mode = "clinician" | "patient";

const defaultInputs: WellsDvtInput = {
  activeCancer: false, bedridden3DaysOrSurgery12Weeks: false,
  paralysisOrPlasterImmobilisation: false, localisedTendernessAlongVeins: false,
  entireLegSwollen: false, calfSwellingOver3cm: false,
  pittingOedemaSymptomaticLeg: false, collateralSuperficialVeins: false,
  previouslyDocumentedDvt: false, alternativeDiagnosisAtLeastAsLikely: false,
};

const booleanFields = [
  "activeCancer", "bedridden3DaysOrSurgery12Weeks",
  "paralysisOrPlasterImmobilisation", "localisedTendernessAlongVeins",
  "entireLegSwollen", "calfSwellingOver3cm",
  "pittingOedemaSymptomaticLeg", "collateralSuperficialVeins",
  "previouslyDocumentedDvt", "alternativeDiagnosisAtLeastAsLikely",
] as const;

export function WellsDvtForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<WellsDvtInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = wellsDvt.formula(inputs);
  const result = wellsDvt.interpret(score);

  function update<K extends keyof WellsDvtInput>(key: K, value: WellsDvtInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <form
        onSubmit={(e) => { e.preventDefault(); }}
        className="glass-panel space-y-6 p-6"
      >
        <BooleanList
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`wellsDvt.fields.${field}` as "wellsDvt.fields.activeCancer"),
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
          riskLabelKey="common.annual_risk"
          i18nNamespace="wellsDvt"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
