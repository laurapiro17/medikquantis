"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { findrisc } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, RadioGroup } from "./Field";

type FindriscInput = findrisc.FindriscInput;
type Mode = "clinician" | "patient";

const defaultInputs: FindriscInput = {
  ageBand: "lt_45",
  bmiBand: "lt_25",
  waistBand: "low",
  dailyPhysicalActivity30Min: true,
  dailyFruitsOrVegetables: true,
  antihypertensiveMedication: false,
  historyOfHighBloodGlucose: false,
  familyHistoryOfDiabetes: "none",
};

const ageBands = ["lt_45", "45_to_54", "55_to_64", "gte_65"] as const;
const bmiBands = ["lt_25", "25_to_30", "gt_30"] as const;
const waistBands = ["low", "moderate", "high"] as const;
const familyBands = ["none", "distant", "close"] as const;

const booleanFields = [
  "dailyPhysicalActivity30Min",
  "dailyFruitsOrVegetables",
  "antihypertensiveMedication",
  "historyOfHighBloodGlucose",
] as const;

export function FindriscForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<FindriscInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = findrisc.formula(inputs);
  const result = findrisc.interpret(score);

  function update<K extends keyof FindriscInput>(key: K, value: FindriscInput[K]) {
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
        <RadioGroup
          name="findrisc-age"
          legend={t("findrisc.fields.ageBand")}
          value={inputs.ageBand}
          onChange={(v) => update("ageBand", v)}
          layout="cards"
          options={ageBands.map((b) => ({
            value: b,
            label: t(`findrisc.age_options.${b}` as "findrisc.age_options.lt_45"),
          }))}
        />
        <RadioGroup
          name="findrisc-bmi"
          legend={t("findrisc.fields.bmiBand")}
          value={inputs.bmiBand}
          onChange={(v) => update("bmiBand", v)}
          layout="cards"
          options={bmiBands.map((b) => ({
            value: b,
            label: t(`findrisc.bmi_options.${b}` as "findrisc.bmi_options.lt_25"),
          }))}
        />
        <RadioGroup
          name="findrisc-waist"
          legend={t("findrisc.fields.waistBand")}
          value={inputs.waistBand}
          onChange={(v) => update("waistBand", v)}
          layout="cards"
          options={waistBands.map((b) => ({
            value: b,
            label: t(`findrisc.waist_options.${b}` as "findrisc.waist_options.low"),
          }))}
        />
        <BooleanList
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`findrisc.fields.${field}` as "findrisc.fields.dailyPhysicalActivity30Min"),
            checked: inputs[field],
            onChange: (v) => update(field, v),
          }))}
        />
        <RadioGroup
          name="findrisc-family"
          legend={t("findrisc.fields.familyHistoryOfDiabetes")}
          value={inputs.familyHistoryOfDiabetes}
          onChange={(v) => update("familyHistoryOfDiabetes", v)}
          layout="cards"
          options={familyBands.map((b) => ({
            value: b,
            label: t(`findrisc.family_options.${b}` as "findrisc.family_options.none"),
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
          annualRiskPercent={result.annualRiskPercent}
          riskLabelKey="common.annual_risk"
          i18nNamespace="findrisc"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
