"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { asaPs } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { BooleanList, FormActions, RadioGroup } from "./Field";

type AsaPsInput = asaPs.AsaPsInput;
type AsaClassValue = asaPs.AsaClassValue;
type Mode = "clinician" | "patient";

const classes: AsaClassValue[] = ["I", "II", "III", "IV", "V", "VI"];

const defaultInputs: AsaPsInput = {
  asaClass: "I",
  emergency: false,
};

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function AsaPsForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<AsaPsInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = asaPs.formula(inputs);
  const result = asaPs.interpret(score, inputs);

  function update<K extends keyof AsaPsInput>(key: K, value: AsaPsInput[K]) {
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
          name="asaClass"
          legend={t("asaPs.question")}
          value={inputs.asaClass}
          onChange={(v) => update("asaClass", v)}
          layout="cards"
          options={classes.map((cls) => ({
            value: cls,
            badge: cls,
            label: t(`asaPs.classes.${cls}` as "asaPs.classes.I"),
          }))}
        />
        <BooleanList
          items={[{
            key: "emergency",
            label: t("asaPs.fields.emergency"),
            checked: inputs.emergency,
            onChange: (v) => update("emergency", v),
          }]}
        />
        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>
      {submitted && (
        <>
          <AsaResultPanel mode={mode} result={result} />
          <div className="glass-panel p-4">
            <ShareActions shareableInputs={inputs} tier={result.tier} mode={mode} />
          </div>
        </>
      )}
    </div>
  );
}

function AsaResultPanel({
  mode, result,
}: {
  mode: Mode;
  result: { classLabel: AsaClassValue; emergency: boolean; tier: "low" | "moderate" | "high"; recommendation: string; evidenceGrade: "A" | "B" | "C" };
}) {
  const t = useTranslations();
  const style = tierStyles[result.tier];
  const label = `${result.classLabel}${result.emergency ? "E" : ""}`;

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            ASA
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-6xl font-semibold leading-none">
            {label}
          </span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}>
            {t(`common.tier_${result.tier}` as "common.tier_low")}
          </span>
        </div>
        <p className="mt-5 text-slate-900 dark:text-slate-100">{result.recommendation}</p>
        <dl className="mt-5 grid gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("common.evidence")}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 dark:text-slate-100">
              {result.evidenceGrade}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  const questions = t.raw("asaPs.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];
  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("asaPs.patient.intro")}</p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">{t(`asaPs.patient.result_${result.tier}` as "asaPs.patient.result_low")}</p>
        <p className="mt-1 font-mono text-sm">ASA: <strong>{label}</strong></p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{t("asaPs.patient.ask_doctor")}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {questionList.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </div>
      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        {t("common.disclaimer")}
      </p>
    </div>
  );
}
