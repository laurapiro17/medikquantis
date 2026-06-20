"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { cha2ds2va } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, NumberInput } from "./Field";

type Cha2ds2vaInput = cha2ds2va.Cha2ds2vaInput;
type Mode = "clinician" | "patient";

const defaultInputs: Cha2ds2vaInput = {
  age: 65,
  chf: false,
  hypertension: false,
  diabetes: false,
  strokeOrTia: false,
  vascularDisease: false,
};

const booleanFields = [
  "chf",
  "hypertension",
  "diabetes",
  "strokeOrTia",
  "vascularDisease",
] as const;

export function Cha2ds2vaForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Cha2ds2vaInput>(defaultInputs);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = cha2ds2va.formula(inputs);
  const result = cha2ds2va.interpret(score);

  function update<K extends keyof Cha2ds2vaInput>(
    key: K,
    value: Cha2ds2vaInput[K],
  ) {
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
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput
            label={t("cha2ds2va.fields.age")}
            value={inputs.age}
            onChange={(v) => update("age", v)}
            min={18}
            max={120}
          />
        </div>

        <BooleanList
          className="border-t border-slate-200 pt-5 dark:border-white/10"
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`cha2ds2va.fields.${field}` as "cha2ds2va.fields.chf"),
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
          i18nNamespace="cha2ds2va"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
