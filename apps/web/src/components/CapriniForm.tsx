"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { caprini } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions } from "./Field";

type CapriniInput = caprini.CapriniInput;
type Mode = "clinician" | "patient";

const defaultInputs: CapriniInput = {
  age41To60: false, minorSurgery: false, bmiOver25: false, swollenLegs: false,
  varicoseVeins: false, sepsisLast1Month: false, seriousLungDisease: false,
  oralContraceptivesOrHrt: false, pregnancyOrPostpartum: false,
  historyOfUnexplainedStillbirth: false, copd: false, amiLast1Month: false,
  chf: false, inflammatoryBowelDisease: false, medicalPatientOnBedrest: false,
  age61To74: false, arthroscopicSurgery: false, majorOpenSurgeryOver45Min: false,
  laparoscopicSurgeryOver45Min: false, malignancy: false, confinedToBedOver72h: false,
  immobilizingPlasterCast: false, centralVenousAccess: false,
  ageOver75: false, historyDvtOrPe: false, familyHistoryOfThrombosis: false,
  thrombophilia: false, hit: false,
  strokeLast1Month: false, electiveMajorLowerExtremityArthroplasty: false,
  hipPelvisOrLegFracture: false, acuteSpinalCordInjuryLast1Month: false,
  multipleTraumaLast1Month: false,
};

const onePtFields = [
  "age41To60", "minorSurgery", "bmiOver25", "swollenLegs", "varicoseVeins",
  "sepsisLast1Month", "seriousLungDisease", "oralContraceptivesOrHrt",
  "pregnancyOrPostpartum", "historyOfUnexplainedStillbirth", "copd",
  "amiLast1Month", "chf", "inflammatoryBowelDisease", "medicalPatientOnBedrest",
] as const;
const twoPtFields = [
  "age61To74", "arthroscopicSurgery", "majorOpenSurgeryOver45Min",
  "laparoscopicSurgeryOver45Min", "malignancy", "confinedToBedOver72h",
  "immobilizingPlasterCast", "centralVenousAccess",
] as const;
const threePtFields = [
  "ageOver75", "historyDvtOrPe", "familyHistoryOfThrombosis",
  "thrombophilia", "hit",
] as const;
const fivePtFields = [
  "strokeLast1Month", "electiveMajorLowerExtremityArthroplasty",
  "hipPelvisOrLegFracture", "acuteSpinalCordInjuryLast1Month",
  "multipleTraumaLast1Month",
] as const;

export function CapriniForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<CapriniInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = caprini.formula(inputs);
  const result = caprini.interpret(score);

  function update<K extends keyof CapriniInput>(key: K, value: CapriniInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
    setSubmitted(false);
  }

  function renderGroup(
    title: string,
    fields: readonly (keyof CapriniInput)[],
  ) {
    return (
      <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-white/10">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <BooleanList
          items={fields.map((field) => ({
            key: field,
            label: t(`caprini.fields.${field}` as "caprini.fields.age41To60"),
            checked: inputs[field] as boolean,
            onChange: (v) => update(field, v as CapriniInput[typeof field]),
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
        {renderGroup(t("caprini.group_one_point"), onePtFields)}
        {renderGroup(t("caprini.group_two_points"), twoPtFields)}
        {renderGroup(t("caprini.group_three_points"), threePtFields)}
        {renderGroup(t("caprini.group_five_points"), fivePtFields)}
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
          i18nNamespace="caprini"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
