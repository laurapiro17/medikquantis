"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { bmi } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type BmiInput = bmi.BmiInput;
type Mode = "clinician" | "patient";

const defaultInputs: BmiInput = {
  height: 170,
  weight: 70,
};

export function BmiForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<BmiInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = bmi.formula(inputs);
  const result = bmi.interpret(score);

  function update<K extends keyof BmiInput>(key: K, value: BmiInput[K]) {
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
            label={t("bmi.fields.height")}
            value={inputs.height}
            onChange={(v) => update("height", v)}
            min={50}
            max={250}
          />
          <NumberInput
            label={t("bmi.fields.weight")}
            value={inputs.weight}
            onChange={(v) => update("weight", v)}
            min={10}
            max={300}
          />
        </div>

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
        i18nNamespace="bmi"
        shareableInputs={inputs}
        unit="kg/m²"
      />
    </div>
  );
}
