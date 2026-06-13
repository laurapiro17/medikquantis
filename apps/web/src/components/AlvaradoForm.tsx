"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { alvarado } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions } from "./Field";

type AlvaradoInput = alvarado.AlvaradoInput;
type Mode = "clinician" | "patient";

const defaultInputs: AlvaradoInput = {
  migrationOfPain: false,
  anorexia: false,
  nauseaOrVomiting: false,
  rightLowerQuadrantTenderness: false,
  reboundTenderness: false,
  elevatedTemperature: false,
  leukocytosis: false,
  leftShift: false,
};

const booleanFields = [
  "migrationOfPain",
  "anorexia",
  "nauseaOrVomiting",
  "rightLowerQuadrantTenderness",
  "reboundTenderness",
  "elevatedTemperature",
  "leukocytosis",
  "leftShift",
] as const;

export function AlvaradoForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<AlvaradoInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = alvarado.formula(inputs);
  const result = alvarado.interpret(score);

  function update<K extends keyof AlvaradoInput>(key: K, value: AlvaradoInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <form
        onSubmit={(e) => { e.preventDefault(); }}
        className="glass-panel space-y-6 p-6"
      >
        <BooleanList
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`alvarado.fields.${field}` as "alvarado.fields.migrationOfPain"),
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
      {(
        <ResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          riskLabelKey="common.annual_risk"
          i18nNamespace="alvarado"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
