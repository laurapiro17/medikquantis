"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { cha2ds2vasc } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, NumberInput, RadioGroup } from "./Field";

type Cha2ds2vascInput = cha2ds2vasc.Cha2ds2vascInput;
type Mode = "clinician" | "patient";

const defaultInputs: Cha2ds2vascInput = {
  age: 65,
  sex: "male",
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

export function Cha2ds2vascForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Cha2ds2vascInput>(defaultInputs);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = cha2ds2vasc.formula(inputs);
  const result = cha2ds2vasc.interpret(score, inputs);

  function update<K extends keyof Cha2ds2vascInput>(key: K, value: Cha2ds2vascInput[K]) {
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
            label={t("cha2ds2vasc.fields.age")}
            value={inputs.age}
            onChange={(v) => update("age", v)}
            min={18}
            max={120}
          />
          <RadioGroup
            name="sex"
            legend={t("cha2ds2vasc.fields.sex")}
            value={inputs.sex}
            onChange={(v) => update("sex", v)}
            options={[
              { value: "male", label: t("common.male") },
              { value: "female", label: t("common.female") },
            ]}
          />
        </div>

        <BooleanList
          className="border-t border-slate-200 pt-5 dark:border-white/10"
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`cha2ds2vasc.fields.${field}` as "cha2ds2vasc.fields.chf"),
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
          i18nNamespace="cha2ds2vasc"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
