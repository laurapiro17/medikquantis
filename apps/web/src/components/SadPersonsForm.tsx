"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { sadPersons } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type SadPersonsInput = sadPersons.SadPersonsInput;
type Mode = "clinician" | "patient";

const defaultInputs: SadPersonsInput = {
  sex: "0",
  age: "0",
  depression: "0",
  previousAttempt: "0",
  ethanolUse: "0",
  rationalThinkingLoss: "0",
  socialSupportsLacking: "0",
  organizedPlan: "0",
  noSpouse: "0",
  sickness: "0",
};

const optionValues = ["0", "1"] as const;
const questions = [
  "sex",
  "age",
  "depression",
  "previousAttempt",
  "ethanolUse",
  "rationalThinkingLoss",
  "socialSupportsLacking",
  "organizedPlan",
  "noSpouse",
  "sickness",
] as const;

export function SadPersonsForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<SadPersonsInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = sadPersons.formula(inputs);
  const result = sadPersons.interpret(score);

  function update<K extends keyof SadPersonsInput>(key: K, value: SadPersonsInput[K]) {
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
        {questions.map((qKey) => (
          <RadioGroup
            key={qKey}
            name={`sadpersons-${qKey}`}
            legend={t(`sadPersons.fields.${qKey}` as "sadPersons.fields.sex")}
            value={inputs[qKey]}
            onChange={(v) => update(qKey, v)}
            layout="cards"
            options={optionValues.map((v) => ({
              value: v,
              badge: v,
              label: t(`sadPersons.options.${v}` as "sadPersons.options.0"),
            }))}
          />
        ))}

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {score >= 5 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          <p className="font-semibold">⚠️ {t("sadPersons.risk_alert")}</p>
        </div>
      )}

      <ResultPanel
        mode={mode}
        score={score}
        tier={result.tier}
        recommendation={result.recommendation}
        evidenceGrade={result.evidenceGrade}
        i18nNamespace="sadPersons"
        shareableInputs={inputs}
      />
    </div>
  );
}
