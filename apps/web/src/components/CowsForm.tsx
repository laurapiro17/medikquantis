"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { cows } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type CowsInput = cows.CowsInput;
type Mode = "clinician" | "patient";

const defaultInputs: CowsInput = {
  hr: "0",
  sweat: "0",
  restless: "0",
  pupils: "0",
  aches: "0",
  rhinorrhea: "0",
  gi: "0",
  tremor: "0",
  yawn: "0",
  anxiety: "0",
  gooseflesh: "0",
};

const items = [
  { key: "hr", options: ["0", "1", "2", "4"] },
  { key: "sweat", options: ["0", "1", "2", "3", "4"] },
  { key: "restless", options: ["0", "1", "3", "5"] },
  { key: "pupils", options: ["0", "1", "2", "5"] },
  { key: "aches", options: ["0", "1", "2", "4"] },
  { key: "rhinorrhea", options: ["0", "1", "2", "4"] },
  { key: "gi", options: ["0", "1", "2", "3", "5"] },
  { key: "tremor", options: ["0", "1", "2", "4"] },
  { key: "yawn", options: ["0", "1", "2", "4"] },
  { key: "anxiety", options: ["0", "1", "2", "4"] },
  { key: "gooseflesh", options: ["0", "3", "5"] },
] as const;

export function CowsForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<CowsInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = cows.formula(inputs);
  const result = cows.interpret(score);

  function update<K extends keyof CowsInput>(key: K, value: CowsInput[K]) {
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
        {items.map((item) => (
          <RadioGroup
            key={item.key}
            name={`cows-${item.key}`}
            legend={t(`cows.fields.${item.key}` as "cows.fields.hr")}
            value={inputs[item.key as keyof CowsInput]}
            onChange={(v) => update(item.key as keyof CowsInput, v as any)}
            layout="cards"
            options={item.options.map((v) => ({
              value: v,
              badge: v,
              label: t(`cows.${item.key}_options.${v}` as "cows.hr_options.0"),
            }))}
          />
        ))}

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
        i18nNamespace="cows"
        shareableInputs={inputs}
      />
    </div>
  );
}
