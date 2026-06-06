"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { centor } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, RadioGroup } from "./Field";

type CentorInput = centor.CentorInput;
type Mode = "clinician" | "patient";

const defaultInputs: CentorInput = {
  tonsillarExudate: false,
  tenderAnteriorCervicalNodes: false,
  feverHistory: false,
  absenceOfCough: false,
  ageBand: "15_to_44",
};

const booleanFields = [
  "tonsillarExudate",
  "tenderAnteriorCervicalNodes",
  "feverHistory",
  "absenceOfCough",
] as const;

const ageBands = ["lt_15", "15_to_44", "gte_45"] as const;

export function CentorForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<CentorInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = centor.formula(inputs);
  const result = centor.interpret(score);

  function update<K extends keyof CentorInput>(
    key: K,
    value: CentorInput[K],
  ) {
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
            label: t(`centor.fields.${field}` as "centor.fields.tonsillarExudate"),
            checked: inputs[field],
            onChange: (v) => update(field, v),
          }))}
        />

        <RadioGroup
          name="centor-age"
          legend={t("centor.fields.ageBand")}
          value={inputs.ageBand}
          onChange={(v) => update("ageBand", v)}
          options={ageBands.map((band) => ({
            value: band,
            label: t(`centor.age_options.${band}` as "centor.age_options.lt_15"),
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
          i18nNamespace="centor"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
