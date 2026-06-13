"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { nihss } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type NihssInput = nihss.NihssInput;
type Mode = "clinician" | "patient";

const defaultInputs: NihssInput = {
  locResponsiveness: 0, locQuestions: 0, locCommands: 0, bestGaze: 0,
  visualFields: 0, facialPalsy: 0, motorArmLeft: 0, motorArmRight: 0,
  motorLegLeft: 0, motorLegRight: 0, limbAtaxia: 0, sensory: 0,
  bestLanguage: 0, dysarthria: 0, extinctionInattention: 0,
};

// Maximum value per item (the schema validates this too; surfaced here
// so the NumberInput max prop matches the clinical scale).
const max: Record<keyof NihssInput, number> = {
  locResponsiveness: 3, locQuestions: 2, locCommands: 2, bestGaze: 2,
  visualFields: 3, facialPalsy: 3, motorArmLeft: 4, motorArmRight: 4,
  motorLegLeft: 4, motorLegRight: 4, limbAtaxia: 2, sensory: 2,
  bestLanguage: 3, dysarthria: 2, extinctionInattention: 2,
};

const fields: (keyof NihssInput)[] = [
  "locResponsiveness", "locQuestions", "locCommands", "bestGaze",
  "visualFields", "facialPalsy", "motorArmLeft", "motorArmRight",
  "motorLegLeft", "motorLegRight", "limbAtaxia", "sensory",
  "bestLanguage", "dysarthria", "extinctionInattention",
];

export function NihssForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<NihssInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = nihss.formula(inputs);
  const result = nihss.interpret(score);

  function update<K extends keyof NihssInput>(key: K, value: NihssInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <p className="text-sm text-slate-600 dark:text-slate-300">{t("nihss.scale_legend")}</p>
      <form
        onSubmit={(e) => { e.preventDefault(); }}
        className="glass-panel space-y-6 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <NumberInput
              key={f}
              label={t(`nihss.fields.${f}` as "nihss.fields.locResponsiveness")}
              value={inputs[f]}
              onChange={(v) => update(f, v as NihssInput[typeof f])}
              min={0}
              max={max[f]}
            />
          ))}
        </div>
        <FormActions submitLabel={t("common.calculate")} resetLabel={t("common.reset")} onReset={reset} />
      </form>
      {(
        <ResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          riskLabelKey="common.annual_risk"
          i18nNamespace="nihss"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
