"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { glasgowBlatchford } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, NumberInput, RadioGroup } from "./Field";

type GlasgowBlatchfordInput = glasgowBlatchford.GlasgowBlatchfordInput;
type Mode = "clinician" | "patient";

const defaultInputs: GlasgowBlatchfordInput = {
  sex: "male",
  bunMgDl: 15,
  hemoglobinGDl: 14,
  systolicBpMmHg: 130,
  heartRateOver100: false,
  melaena: false,
  syncope: false,
  hepaticDisease: false,
  cardiacFailure: false,
};

const booleanFields = [
  "heartRateOver100", "melaena", "syncope", "hepaticDisease", "cardiacFailure",
] as const;

export function GlasgowBlatchfordForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<GlasgowBlatchfordInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = glasgowBlatchford.formula(inputs);
  const result = glasgowBlatchford.interpret(score);

  function update<K extends keyof GlasgowBlatchfordInput>(
    key: K, value: GlasgowBlatchfordInput[K],
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
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="glass-panel space-y-6 p-6"
      >
        <RadioGroup
          name="gbs-sex"
          legend={t("glasgowBlatchford.fields.sex")}
          value={inputs.sex}
          onChange={(v) => update("sex", v)}
          options={[
            { value: "male", label: t("common.male") },
            { value: "female", label: t("common.female") },
          ]}
        />
        <div className="grid gap-6 sm:grid-cols-3">
          <NumberInput
            label={t("glasgowBlatchford.fields.bunMgDl")}
            value={inputs.bunMgDl}
            onChange={(v) => update("bunMgDl", v)}
            min={0} max={500}
          />
          <NumberInput
            label={t("glasgowBlatchford.fields.hemoglobinGDl")}
            value={inputs.hemoglobinGDl}
            onChange={(v) => update("hemoglobinGDl", v)}
            min={3} max={25}
          />
          <NumberInput
            label={t("glasgowBlatchford.fields.systolicBpMmHg")}
            value={inputs.systolicBpMmHg}
            onChange={(v) => update("systolicBpMmHg", v)}
            min={40} max={300}
          />
        </div>
        <BooleanList
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`glasgowBlatchford.fields.${field}` as "glasgowBlatchford.fields.heartRateOver100"),
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
          riskLabelKey="common.annual_risk"
          i18nNamespace="glasgowBlatchford"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
