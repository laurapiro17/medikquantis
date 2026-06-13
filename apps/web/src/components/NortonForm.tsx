"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { norton } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type NortonInput = norton.NortonInput;
type Mode = "clinician" | "patient";

const defaultInputs: NortonInput = {
  physicalCondition: "4",
  mentalCondition: "4",
  activity: "4",
  mobility: "4",
  incontinence: "4",
};

const values14 = ["1", "2", "3", "4"] as const;

const fields = [
  "physicalCondition",
  "mentalCondition",
  "activity",
  "mobility",
  "incontinence",
] as const;

export function NortonForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<NortonInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = norton.formula(inputs);
  const result = norton.interpret(score);

  function update<K extends keyof NortonInput>(key: K, value: NortonInput[K]) {
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
        {fields.map((f) => (
          <RadioGroup
            key={f}
            name={`norton-${f}`}
            legend={t(`norton.fields.${f}` as "norton.fields.physicalCondition")}
            value={inputs[f]}
            onChange={(v) => update(f, v as NortonInput[typeof f])}
            layout="cards"
            options={values14.map((v) => ({
              value: v,
              badge: v,
              label: t(`norton.${f}_options.${v}` as "norton.physicalCondition_options.4"),
            }))}
          />
        ))}
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
          i18nNamespace="norton"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
