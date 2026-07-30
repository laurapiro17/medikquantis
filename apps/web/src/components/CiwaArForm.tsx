"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { ciwaAr } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type CiwaArInput = ciwaAr.CiwaArInput;
type Mode = "clinician" | "patient";

const defaultInputs: CiwaArInput = {
  nausea: "0",
  tremor: "0",
  sweats: "0",
  anxiety: "0",
  agitation: "0",
  tactile: "0",
  auditory: "0",
  visual: "0",
  headache: "0",
  orientation: "0",
};

const items7 = [
  { key: "nausea", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
  { key: "tremor", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
  { key: "sweats", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
  { key: "anxiety", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
  { key: "agitation", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
  { key: "tactile", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
  { key: "auditory", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
  { key: "visual", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
  { key: "headache", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
] as const;

const orientationOptions = ["0", "1", "2", "3", "4"] as const;

export function CiwaArForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<CiwaArInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = ciwaAr.formula(inputs);
  const result = ciwaAr.interpret(score);

  function update<K extends keyof CiwaArInput>(key: K, value: CiwaArInput[K]) {
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
        {items7.map((item) => (
          <RadioGroup
            key={item.key}
            name={`ciwa-${item.key}`}
            legend={t(`ciwaAr.fields.${item.key}` as "ciwaAr.fields.nausea")}
            value={inputs[item.key as keyof CiwaArInput]}
            onChange={(v) => update(item.key as keyof CiwaArInput, v as any)}
            layout="cards"
            options={item.options.map((v) => ({
              value: v,
              badge: v,
              label: t(`ciwaAr.${item.key}_options.${v}` as "ciwaAr.nausea_options.0"),
            }))}
          />
        ))}

        <RadioGroup
          name="ciwa-orientation"
          legend={t("ciwaAr.fields.orientation")}
          value={inputs.orientation}
          onChange={(v) => update("orientation", v)}
          layout="cards"
          options={orientationOptions.map((v) => ({
            value: v,
            badge: v,
            label: t(`ciwaAr.orientation_options.${v}` as "ciwaAr.orientation_options.0"),
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
        i18nNamespace="ciwaAr"
        shareableInputs={inputs}
      />
    </div>
  );
}
