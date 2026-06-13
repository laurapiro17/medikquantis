"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { psaDensity } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";
import { useUrlInputs } from "./useUrlInputs";

type PsaDensityInput = psaDensity.PsaDensityInput;
type Mode = "clinician" | "patient";

const defaultInputs: PsaDensityInput = {
  psaNgMl: 5,
  prostateVolumeMl: 40,
};

export function PsaDensityForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<PsaDensityInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const density = psaDensity.formula(inputs);
  const result = psaDensity.interpret(density);

  function update<K extends keyof PsaDensityInput>(
    key: K,
    value: PsaDensityInput[K],
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
            label={t("psaDensity.fields.psaNgMl")}
            value={inputs.psaNgMl}
            onChange={(v) => update("psaNgMl", v)}
            min={0}
            max={200}
          />
          <NumberInput
            label={t("psaDensity.fields.prostateVolumeMl")}
            value={inputs.prostateVolumeMl}
            onChange={(v) => update("prostateVolumeMl", v)}
            min={1}
            max={500}
          />
        </div>

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {(
        <ResultPanel
          mode={mode}
          score={density}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          riskLabelKey="common.annual_risk"
          i18nNamespace="psaDensity"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
