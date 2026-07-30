"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { apgar } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type ApgarInput = apgar.ApgarInput;
type Mode = "clinician" | "patient";

const defaultInputs: ApgarInput = {
  appearance: "2",
  pulse: "2",
  grimace: "2",
  activity: "2",
  respiration: "2",
};

const optionValues = ["0", "1", "2"] as const;

export function ApgarForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<ApgarInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = apgar.formula(inputs);
  const result = apgar.interpret(score);

  function update<K extends keyof ApgarInput>(key: K, value: ApgarInput[K]) {
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
        <RadioGroup
          name="apgar-appearance"
          legend={t("apgar.fields.appearance")}
          value={inputs.appearance}
          onChange={(v) => update("appearance", v)}
          layout="cards"
          options={optionValues.map((v) => ({
            value: v,
            badge: v,
            label: t(`apgar.options.appearance_${v}` as "apgar.options.appearance_0"),
          }))}
        />
        <RadioGroup
          name="apgar-pulse"
          legend={t("apgar.fields.pulse")}
          value={inputs.pulse}
          onChange={(v) => update("pulse", v)}
          layout="cards"
          options={optionValues.map((v) => ({
            value: v,
            badge: v,
            label: t(`apgar.options.pulse_${v}` as "apgar.options.pulse_0"),
          }))}
        />
        <RadioGroup
          name="apgar-grimace"
          legend={t("apgar.fields.grimace")}
          value={inputs.grimace}
          onChange={(v) => update("grimace", v)}
          layout="cards"
          options={optionValues.map((v) => ({
            value: v,
            badge: v,
            label: t(`apgar.options.grimace_${v}` as "apgar.options.grimace_0"),
          }))}
        />
        <RadioGroup
          name="apgar-activity"
          legend={t("apgar.fields.activity")}
          value={inputs.activity}
          onChange={(v) => update("activity", v)}
          layout="cards"
          options={optionValues.map((v) => ({
            value: v,
            badge: v,
            label: t(`apgar.options.activity_${v}` as "apgar.options.activity_0"),
          }))}
        />
        <RadioGroup
          name="apgar-respiration"
          legend={t("apgar.fields.respiration")}
          value={inputs.respiration}
          onChange={(v) => update("respiration", v)}
          layout="cards"
          options={optionValues.map((v) => ({
            value: v,
            badge: v,
            label: t(`apgar.options.respiration_${v}` as "apgar.options.respiration_0"),
          }))}
        />

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      <ResultPanel
        mode={mode}
        score={score}
        tier={result.tier}
        recommendation={result.recommendation}
        evidenceGrade={result.evidenceGrade}
        i18nNamespace="apgar"
        shareableInputs={inputs}
      />
    </div>
  );
}
