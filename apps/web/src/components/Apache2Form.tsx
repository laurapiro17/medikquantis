"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { apache2 } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type Apache2Input = apache2.Apache2Input;
type Mode = "clinician" | "patient";

const defaultInputs: Apache2Input = {
  temperature: 0, meanArterialPressure: 0, heartRate: 0, respiratoryRate: 0,
  oxygenation: 0, arterialPh: 0, sodium: 0, potassium: 0, creatinine: 0,
  hematocrit: 0, whiteCellCount: 0, glasgowComaScore: 0,
  agePoints: 0, chronicHealthPoints: 0,
};

const apsFields: (keyof Apache2Input)[] = [
  "temperature", "meanArterialPressure", "heartRate", "respiratoryRate",
  "oxygenation", "arterialPh", "sodium", "potassium", "creatinine",
  "hematocrit", "whiteCellCount",
];

export function Apache2Form() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Apache2Input>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = apache2.formula(inputs);
  const result = apache2.interpret(score);

  function update<K extends keyof Apache2Input>(key: K, value: Apache2Input[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <p className="text-sm text-slate-600 dark:text-slate-300">{t("apache2.scale_legend")}</p>
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="glass-panel space-y-6 p-6"
      >
        <fieldset className="space-y-3">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("apache2.section_aps")}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {apsFields.map((f) => (
              <NumberInput
                key={f}
                label={t(`apache2.fields.${f}` as "apache2.fields.temperature")}
                value={inputs[f]}
                onChange={(v) => update(f, v as Apache2Input[typeof f])}
                min={0} max={4}
              />
            ))}
            <NumberInput
              label={t("apache2.fields.glasgowComaScore")}
              value={inputs.glasgowComaScore}
              onChange={(v) => update("glasgowComaScore", v)}
              min={0} max={12}
            />
          </div>
        </fieldset>
        <fieldset className="space-y-3 border-t border-slate-200 pt-4 dark:border-white/10">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("apache2.section_age_chronic")}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput label={t("apache2.fields.agePoints")} value={inputs.agePoints} onChange={(v) => update("agePoints", v)} min={0} max={6} />
            <NumberInput label={t("apache2.fields.chronicHealthPoints")} value={inputs.chronicHealthPoints} onChange={(v) => update("chronicHealthPoints", v)} min={0} max={5} />
          </div>
        </fieldset>
        <FormActions submitLabel={t("common.calculate")} resetLabel={t("common.reset")} onReset={reset} />
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
          i18nNamespace="apache2"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
