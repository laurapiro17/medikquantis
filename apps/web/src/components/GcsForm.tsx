"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { gcs } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type GcsInput = gcs.GcsInput;
type Mode = "clinician" | "patient";

const defaultInputs: GcsInput = {
  eye: "4",
  verbal: "5",
  motor: "6",
};

const eyeValues = ["1", "2", "3", "4"] as const;
const verbalValues = ["1", "2", "3", "4", "5"] as const;
const motorValues = ["1", "2", "3", "4", "5", "6"] as const;

export function GcsForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<GcsInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = gcs.formula(inputs);
  const result = gcs.interpret(score);

  function update<K extends keyof GcsInput>(key: K, value: GcsInput[K]) {
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
          name="gcs-eye"
          legend={t("gcs.fields.eye")}
          value={inputs.eye}
          onChange={(v) => update("eye", v)}
          layout="cards"
          options={eyeValues.map((v) => ({
            value: v,
            badge: v,
            label: t(`gcs.eye_options.${v}` as "gcs.eye_options.1"),
          }))}
        />
        <RadioGroup
          name="gcs-verbal"
          legend={t("gcs.fields.verbal")}
          value={inputs.verbal}
          onChange={(v) => update("verbal", v)}
          layout="cards"
          options={verbalValues.map((v) => ({
            value: v,
            badge: v,
            label: t(`gcs.verbal_options.${v}` as "gcs.verbal_options.1"),
          }))}
        />
        <RadioGroup
          name="gcs-motor"
          legend={t("gcs.fields.motor")}
          value={inputs.motor}
          onChange={(v) => update("motor", v)}
          layout="cards"
          options={motorValues.map((v) => ({
            value: v,
            badge: v,
            label: t(`gcs.motor_options.${v}` as "gcs.motor_options.1"),
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
          i18nNamespace="gcs"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
