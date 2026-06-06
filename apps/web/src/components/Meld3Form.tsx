"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { meld3 } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, NumberInput, RadioGroup } from "./Field";

type Meld3Input = meld3.Meld3Input;
type Mode = "clinician" | "patient";

const defaultInputs: Meld3Input = {
  sex: "male",
  creatinine: 1.0,
  bilirubin: 1.0,
  inr: 1.0,
  sodium: 137,
  albumin: 3.5,
  onDialysisLast7Days: false,
};

export function Meld3Form() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Meld3Input>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const score = meld3.formula(inputs);
  const result = meld3.interpret(score);

  function update<K extends keyof Meld3Input>(key: K, value: Meld3Input[K]) {
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
        <RadioGroup
          name="sex"
          legend={t("meld3.fields.sex")}
          value={inputs.sex}
          onChange={(v) => update("sex", v)}
          options={[
            { value: "male", label: t("common.male") },
            { value: "female", label: t("common.female") },
          ]}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <NumberInput
            label={t("meld3.fields.creatinine")}
            value={inputs.creatinine}
            onChange={(v) => update("creatinine", v)}
            min={0.1}
            max={20}
          />
          <NumberInput
            label={t("meld3.fields.bilirubin")}
            value={inputs.bilirubin}
            onChange={(v) => update("bilirubin", v)}
            min={0.1}
            max={100}
          />
          <NumberInput
            label={t("meld3.fields.inr")}
            value={inputs.inr}
            onChange={(v) => update("inr", v)}
            min={0.5}
            max={20}
          />
          <NumberInput
            label={t("meld3.fields.sodium")}
            value={inputs.sodium}
            onChange={(v) => update("sodium", v)}
            min={100}
            max={160}
          />
          <NumberInput
            label={t("meld3.fields.albumin")}
            value={inputs.albumin}
            onChange={(v) => update("albumin", v)}
            min={0.5}
            max={8}
          />
        </div>

        <BooleanList
          className="border-t border-slate-200 pt-5 dark:border-white/10"
          items={[{
            key: "onDialysisLast7Days",
            label: t("meld3.fields.onDialysisLast7Days"),
            checked: inputs.onDialysisLast7Days,
            onChange: (v) => update("onDialysisLast7Days", v),
          }]}
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
          i18nNamespace="meld3"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
