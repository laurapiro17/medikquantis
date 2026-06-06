"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { pittBacteremia } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, RadioGroup } from "./Field";

type PittBacteremiaInput = pittBacteremia.PittBacteremiaInput;
type Mode = "clinician" | "patient";

const defaultInputs: PittBacteremiaInput = {
  temperatureBand: "normal",
  hypotension: false,
  mechanicalVentilation: false,
  cardiacArrestWithin24h: false,
  mentalStatus: "alert",
};

const tempBands = ["normal", "mild", "severe"] as const;
const mentalStates = ["alert", "disoriented", "stuporous", "comatose"] as const;
const booleanFields = [
  "hypotension",
  "mechanicalVentilation",
  "cardiacArrestWithin24h",
] as const;

export function PittBacteremiaForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<PittBacteremiaInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = pittBacteremia.formula(inputs);
  const result = pittBacteremia.interpret(score);

  function update<K extends keyof PittBacteremiaInput>(
    key: K,
    value: PittBacteremiaInput[K],
  ) {
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
        <RadioGroup
          name="pitt-temp"
          legend={t("pittBacteremia.fields.temperatureBand")}
          value={inputs.temperatureBand}
          onChange={(v) => update("temperatureBand", v)}
          layout="cards"
          options={tempBands.map((b) => ({
            value: b,
            label: t(`pittBacteremia.temperature.${b}` as "pittBacteremia.temperature.normal"),
          }))}
        />
        <RadioGroup
          name="pitt-mental"
          legend={t("pittBacteremia.fields.mentalStatus")}
          value={inputs.mentalStatus}
          onChange={(v) => update("mentalStatus", v)}
          layout="cards"
          options={mentalStates.map((m) => ({
            value: m,
            label: t(`pittBacteremia.mental.${m}` as "pittBacteremia.mental.alert"),
          }))}
        />
        <BooleanList
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`pittBacteremia.fields.${field}` as "pittBacteremia.fields.hypotension"),
            checked: inputs[field],
            onChange: (v) => update(field, v),
          }))}
        />
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
          i18nNamespace="pittBacteremia"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
