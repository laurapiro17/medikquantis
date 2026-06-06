"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { lrinec } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput } from "./Field";

type LrinecInput = lrinec.LrinecInput;
type Mode = "clinician" | "patient";

const defaultInputs: LrinecInput = {
  crpMgDl: 5,
  wbcPerMm3: 10000,
  hemoglobinGDl: 14,
  sodiumMEqL: 138,
  creatinineMgDl: 1.0,
  glucoseMgDl: 100,
};

export function LrinecForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<LrinecInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = lrinec.formula(inputs);
  const result = lrinec.interpret(score);

  function update<K extends keyof LrinecInput>(key: K, value: LrinecInput[K]) {
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
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput
            label={t("lrinec.fields.crpMgDl")}
            value={inputs.crpMgDl}
            onChange={(v) => update("crpMgDl", v)}
            min={0}
            max={100}
          />
          <NumberInput
            label={t("lrinec.fields.wbcPerMm3")}
            value={inputs.wbcPerMm3}
            onChange={(v) => update("wbcPerMm3", v)}
            min={0}
            max={100000}
          />
          <NumberInput
            label={t("lrinec.fields.hemoglobinGDl")}
            value={inputs.hemoglobinGDl}
            onChange={(v) => update("hemoglobinGDl", v)}
            min={3}
            max={25}
          />
          <NumberInput
            label={t("lrinec.fields.sodiumMEqL")}
            value={inputs.sodiumMEqL}
            onChange={(v) => update("sodiumMEqL", v)}
            min={100}
            max={180}
          />
          <NumberInput
            label={t("lrinec.fields.creatinineMgDl")}
            value={inputs.creatinineMgDl}
            onChange={(v) => update("creatinineMgDl", v)}
            min={0}
            max={15}
          />
          <NumberInput
            label={t("lrinec.fields.glucoseMgDl")}
            value={inputs.glucoseMgDl}
            onChange={(v) => update("glucoseMgDl", v)}
            min={40}
            max={2000}
          />
        </div>
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
          i18nNamespace="lrinec"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
