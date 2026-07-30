"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { phq9 } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type Phq9Input = phq9.Phq9Input;
type Mode = "clinician" | "patient";

const defaultInputs: Phq9Input = {
  q1: "0",
  q2: "0",
  q3: "0",
  q4: "0",
  q5: "0",
  q6: "0",
  q7: "0",
  q8: "0",
  q9: "0",
};

const optionValues = ["0", "1", "2", "3"] as const;
const questions = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"] as const;

export function Phq9Form() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Phq9Input>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = phq9.formula(inputs);
  const result = phq9.interpret(score);

  function update<K extends keyof Phq9Input>(key: K, value: Phq9Input[K]) {
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
            name={`phq9-${qKey}`}
            legend={t(`phq9.fields.${qKey}` as "phq9.fields.q1")}
            value={inputs[qKey]}
            onChange={(v) => update(qKey, v)}
            layout="cards"
            options={optionValues.map((v) => ({
              value: v,
              badge: v,
              label: t(`phq9.options.${v}` as "phq9.options.0"),
            }))}
          />
        ))}

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {inputs.q9 !== "0" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          <p className="font-semibold">⚠️ {t("phq9.suicide_alert")}</p>
        </div>
      )}

      <ResultPanel
        mode={mode}
        score={score}
        tier={result.tier}
        recommendation={result.recommendation}
        evidenceGrade={result.evidenceGrade}
        i18nNamespace="phq9"
        shareableInputs={inputs}
      />
    </div>
  );
}
