"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { bsaMosteller } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type BsaMostellerInput = bsaMosteller.BsaMostellerInput;
type Mode = "clinician" | "patient";

const defaultInputs: BsaMostellerInput = {
  height: 170,
  weight: 70,
};

export function BsaMostellerForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<BsaMostellerInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = bsaMosteller.formula(inputs);
  const result = bsaMosteller.interpret(score);

  function update<K extends keyof BsaMostellerInput>(
    key: K,
    value: BsaMostellerInput[K]
  ) {
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
            label={t("bsaMosteller.fields.height")}
            value={inputs.height}
            onChange={(v) => update("height", v)}
            min={10}
            max={250}
          />
          <NumberInput
            label={t("bsaMosteller.fields.weight")}
            value={inputs.weight}
            onChange={(v) => update("weight", v)}
            min={0.5}
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
        i18nNamespace="bsaMosteller"
        shareableInputs={inputs}
        unit="m²"
      />
    </div>
  );
}
