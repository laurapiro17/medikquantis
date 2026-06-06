"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { ipss } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, RadioGroup } from "./Field";

type IpssInput = ipss.IpssInput;
type Mode = "clinician" | "patient";

const defaultInputs: IpssInput = {
  incompleteEmptying: "0",
  frequency: "0",
  intermittency: "0",
  urgency: "0",
  weakStream: "0",
  straining: "0",
  nocturia: "0",
};

const fields = [
  "incompleteEmptying",
  "frequency",
  "intermittency",
  "urgency",
  "weakStream",
  "straining",
  "nocturia",
] as const;

const values = ["0", "1", "2", "3", "4", "5"] as const;

export function IpssForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<IpssInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = ipss.formula(inputs);
  const result = ipss.interpret(score);

  function update<K extends keyof IpssInput>(key: K, value: IpssInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t("ipss.scale_legend")}
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="glass-panel space-y-6 p-6"
      >
        {fields.map((f) => (
          <RadioGroup
            key={f}
            name={`ipss-${f}`}
            legend={t(`ipss.fields.${f}` as "ipss.fields.incompleteEmptying")}
            value={inputs[f]}
            onChange={(v) => update(f, v as IpssInput[typeof f])}
            layout="cards"
            options={values.map((v) => ({
              value: v,
              badge: v,
              label: t(`ipss.frequency_options.${v}` as "ipss.frequency_options.0"),
            }))}
          />
        ))}
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
          i18nNamespace="ipss"
          shareableInputs={inputs}
        />
      )}
    </div>
  );
}
