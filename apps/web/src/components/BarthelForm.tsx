"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { barthel } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type BarthelInput = barthel.BarthelInput;
type Mode = "clinician" | "patient";

const defaultInputs: BarthelInput = {
  feeding: "10",
  bathing: "5",
  grooming: "5",
  dressing: "10",
  bowels: "10",
  bladder: "10",
  toiletUse: "10",
  transfers: "15",
  mobility: "15",
  stairs: "10",
};

// Per Barthel item, the legal point set differs (5-pt, 10-pt or 15-pt
// items). The form renders a RadioGroup per item with the right options.
const itemConfig: Record<keyof BarthelInput, readonly string[]> = {
  feeding: ["0", "5", "10"],
  bathing: ["0", "5"],
  grooming: ["0", "5"],
  dressing: ["0", "5", "10"],
  bowels: ["0", "5", "10"],
  bladder: ["0", "5", "10"],
  toiletUse: ["0", "5", "10"],
  transfers: ["0", "5", "10", "15"],
  mobility: ["0", "5", "10", "15"],
  stairs: ["0", "5", "10"],
};

export function BarthelForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<BarthelInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = barthel.formula(inputs);
  const result = barthel.interpret(score);

  function update<K extends keyof BarthelInput>(key: K, value: BarthelInput[K]) {
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
        {(Object.keys(itemConfig) as (keyof BarthelInput)[]).map((field) => (
          <RadioGroup
            key={field}
            name={`barthel-${field}`}
            legend={t(`barthel.fields.${field}` as "barthel.fields.feeding")}
            value={inputs[field]}
            onChange={(v) => update(field, v as BarthelInput[typeof field])}
            layout="cards"
            options={itemConfig[field].map((v) => ({
              value: v,
              badge: v,
              label: t(`barthel.${field}_options.${v}` as "barthel.feeding_options.10"),
            }))}
          />
        ))}
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
          i18nNamespace="barthel"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
