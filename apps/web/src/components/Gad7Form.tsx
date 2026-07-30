"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { gad7 } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type Gad7Input = gad7.Gad7Input;
type Mode = "clinician" | "patient";

const defaultInputs: Gad7Input = {
  q1: "0",
  q2: "0",
  q3: "0",
  q4: "0",
  q5: "0",
  q6: "0",
  q7: "0",
};

const optionValues = ["0", "1", "2", "3"] as const;
const questions = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;

export function Gad7Form() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Gad7Input>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = gad7.formula(inputs);
  const result = gad7.interpret(score);

  function update<K extends keyof Gad7Input>(key: K, value: Gad7Input[K]) {
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
            name={`gad7-${qKey}`}
            legend={t(`gad7.fields.${qKey}` as "gad7.fields.q1")}
            value={inputs[qKey]}
            onChange={(v) => update(qKey, v)}
            layout="cards"
            options={optionValues.map((v) => ({
              value: v,
              badge: v,
              label: t(`gad7.options.${v}` as "gad7.options.0"),
            }))}
          />
        ))}

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      <ResultPanel
        mode={mode}
        score={score}
        tier={result.tier}
        recommendation={result.recommendation}
        evidenceGrade={result.evidenceGrade}
        i18nNamespace="gad7"
        shareableInputs={inputs}
      />
    </div>
  );
}
