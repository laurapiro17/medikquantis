"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { rcri } from "@medcalc/calculators";
import { parseLang, translateRecommendation } from "@/lib/api-recommendations";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions } from "./Field";

type RcriInput = rcri.RcriInput;
type Mode = "clinician" | "patient";

const defaultInputs: RcriInput = {
  highRiskSurgery: false,
  ischemicHeartDisease: false,
  congestiveHeartFailure: false,
  cerebrovascularDisease: false,
  preoperativeInsulin: false,
  creatinineOver2: false,
};

const booleanFields = [
  "highRiskSurgery",
  "ischemicHeartDisease",
  "congestiveHeartFailure",
  "cerebrovascularDisease",
  "preoperativeInsulin",
  "creatinineOver2",
] as const;

export function RcriForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [inputs, setInputs] = useState<RcriInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = rcri.formula(inputs);
  const result = rcri.interpret(score);

  function update<K extends keyof RcriInput>(key: K, value: RcriInput[K]) {
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
            label: t(`rcri.fields.${field}` as "rcri.fields.highRiskSurgery"),
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
          recommendation={translateRecommendation(
            result.recommendationCode,
            parseLang(locale),
            result.recommendation,
          )}
          evidenceGrade={result.evidenceGrade}
          annualRiskPercent={result.annualRiskPercent}
          riskLabelKey="rcri.risk_label_periop"
          i18nNamespace="rcri"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
