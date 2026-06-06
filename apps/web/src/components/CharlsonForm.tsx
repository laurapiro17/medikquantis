"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { charlson } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, NumberInput } from "./Field";

type CharlsonInput = charlson.CharlsonInput;
type Mode = "clinician" | "patient";

const defaultInputs: CharlsonInput = {
  ageYears: 60,
  myocardialInfarction: false,
  congestiveHeartFailure: false,
  peripheralVascularDisease: false,
  cerebrovascularDisease: false,
  dementia: false,
  chronicPulmonaryDisease: false,
  connectiveTissueDisease: false,
  pepticUlcerDisease: false,
  mildLiverDisease: false,
  diabetesUncomplicated: false,
  hemiplegia: false,
  moderateSevereRenalDisease: false,
  diabetesWithEndOrganDamage: false,
  anyTumorPast5Years: false,
  leukemia: false,
  lymphoma: false,
  moderateSevereLiverDisease: false,
  metastaticSolidTumor: false,
  aids: false,
};

const onePtFields = [
  "myocardialInfarction",
  "congestiveHeartFailure",
  "peripheralVascularDisease",
  "cerebrovascularDisease",
  "dementia",
  "chronicPulmonaryDisease",
  "connectiveTissueDisease",
  "pepticUlcerDisease",
  "mildLiverDisease",
  "diabetesUncomplicated",
] as const;

const twoPtFields = [
  "hemiplegia",
  "moderateSevereRenalDisease",
  "diabetesWithEndOrganDamage",
  "anyTumorPast5Years",
  "leukemia",
  "lymphoma",
] as const;

const threePtFields = ["moderateSevereLiverDisease"] as const;
const sixPtFields = ["metastaticSolidTumor", "aids"] as const;

export function CharlsonForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<CharlsonInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = charlson.formula(inputs);
  const result = charlson.interpret(score);

  function update<K extends keyof CharlsonInput>(key: K, value: CharlsonInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
    setSubmitted(false);
  }

  function renderGroup(
    title: string,
    fields: readonly (keyof CharlsonInput)[],
  ) {
    return (
      <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-white/10">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <BooleanList
          items={fields.map((field) => ({
            key: field,
            label: t(`charlson.fields.${field}` as "charlson.fields.myocardialInfarction"),
            checked: inputs[field] as boolean,
            onChange: (v) => update(field, v as CharlsonInput[typeof field]),
          }))}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="glass-panel space-y-6 p-6"
      >
        <NumberInput
          label={t("charlson.fields.ageYears")}
          value={inputs.ageYears}
          onChange={(v) => update("ageYears", v)}
          min={0}
          max={120}
        />
        {renderGroup(t("charlson.group_one_point"), onePtFields)}
        {renderGroup(t("charlson.group_two_points"), twoPtFields)}
        {renderGroup(t("charlson.group_three_points"), threePtFields)}
        {renderGroup(t("charlson.group_six_points"), sixPtFields)}
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
          annualRiskPercent={result.annualRiskPercent}
          riskLabelKey="common.annual_risk"
          i18nNamespace="charlson"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
