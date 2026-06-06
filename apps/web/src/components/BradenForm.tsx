"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { braden } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type BradenInput = braden.BradenInput;
type Mode = "clinician" | "patient";

const defaultInputs: BradenInput = {
  sensoryPerception: "4",
  moisture: "4",
  activity: "4",
  mobility: "4",
  nutrition: "4",
  frictionAndShear: "3",
};

const values14 = ["1", "2", "3", "4"] as const;
const values13 = ["1", "2", "3"] as const;

const fields14 = [
  "sensoryPerception",
  "moisture",
  "activity",
  "mobility",
  "nutrition",
] as const;

export function BradenForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<BradenInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = braden.formula(inputs);
  const result = braden.interpret(score);

  function update<K extends keyof BradenInput>(key: K, value: BradenInput[K]) {
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
        {fields14.map((f) => (
          <RadioGroup
            key={f}
            name={`braden-${f}`}
            legend={t(`braden.fields.${f}` as "braden.fields.sensoryPerception")}
            value={inputs[f]}
            onChange={(v) => update(f, v as BradenInput[typeof f])}
            layout="cards"
            options={values14.map((v) => ({
              value: v,
              badge: v,
              label: t(`braden.${f}_options.${v}` as "braden.sensoryPerception_options.4"),
            }))}
          />
        ))}
        <RadioGroup
          name="braden-friction"
          legend={t("braden.fields.frictionAndShear")}
          value={inputs.frictionAndShear}
          onChange={(v) => update("frictionAndShear", v as BradenInput["frictionAndShear"])}
          layout="cards"
          options={values13.map((v) => ({
            value: v,
            badge: v,
            label: t(`braden.frictionAndShear_options.${v}` as "braden.frictionAndShear_options.3"),
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
          i18nNamespace="braden"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
