"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { pasi } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type PasiInput = pasi.PasiInput;
type Mode = "clinician" | "patient";

const defaultRegion = { area: 0, erythema: 0, induration: 0, desquamation: 0 };
const defaultInputs: PasiInput = {
  head: { ...defaultRegion },
  upperLimbs: { ...defaultRegion },
  trunk: { ...defaultRegion },
  lowerLimbs: { ...defaultRegion },
};

const regions = ["head", "upperLimbs", "trunk", "lowerLimbs"] as const;
const features = ["area", "erythema", "induration", "desquamation"] as const;

export function PasiForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<PasiInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs } as PasiInput));
    setSubmitted(true);
  }, [urlInputs]);

  const score = pasi.formula(inputs);
  const result = pasi.interpret(score);

  function updateRegion(
    region: typeof regions[number],
    feature: typeof features[number],
    value: number,
  ) {
    setInputs((prev) => ({
      ...prev,
      [region]: { ...prev[region], [feature]: value },
    }));
  }

  function reset() {
    setInputs(defaultInputs);
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t("pasi.scale_legend")}
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="glass-panel space-y-8 p-6"
      >
        {regions.map((region) => (
          <fieldset key={region} className="space-y-4 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0 dark:border-white/10">
            <legend className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t(`pasi.regions.${region}` as "pasi.regions.head")}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <NumberInput
                  key={feature}
                  label={t(`pasi.features.${feature}` as "pasi.features.area")}
                  value={inputs[region][feature]}
                  onChange={(v) => updateRegion(region, feature, v)}
                  min={0}
                  max={feature === "area" ? 6 : 4}
                />
              ))}
            </div>
          </fieldset>
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
          i18nNamespace="pasi"
          shareableInputs={inputs as unknown as Record<string, unknown>}
        />
      )}
    </div>
  );
}
