"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { sofa } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type SofaInput = sofa.SofaInput;
type Mode = "clinician" | "patient";

const defaultInputs: SofaInput = {
  respiration: 0, coagulation: 0, liver: 0,
  cardiovascular: 0, cns: 0, renal: 0,
};

const fields: (keyof SofaInput)[] = [
  "respiration", "coagulation", "liver", "cardiovascular", "cns", "renal",
];

export function SofaForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<SofaInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = sofa.formula(inputs);
  const result = sofa.interpret(score);

  function update<K extends keyof SofaInput>(key: K, value: SofaInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <p className="text-sm text-slate-600 dark:text-slate-300">{t("sofa.scale_legend")}</p>
      <form
        onSubmit={(e) => { e.preventDefault(); }}
        className="glass-panel space-y-6 p-6"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <NumberInput
              key={f}
              label={t(`sofa.fields.${f}` as "sofa.fields.respiration")}
              value={inputs[f]}
              onChange={(v) => update(f, v as SofaInput[typeof f])}
              min={0} max={4}
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
          annualRiskPercent={result.annualRiskPercent}
          riskLabelKey="common.annual_risk"
          i18nNamespace="sofa"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
