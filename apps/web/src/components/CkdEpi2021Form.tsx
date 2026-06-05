"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ckdEpi2021 } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { FormActions, NumberInput, RadioGroup } from "./Field";

type CkdEpi2021Input = ckdEpi2021.CkdEpi2021Input;
type Mode = "clinician" | "patient";

const defaultInputs: CkdEpi2021Input = {
  age: 65,
  sex: "male",
  creatinine: 1.0,
};

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function CkdEpi2021Form() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<CkdEpi2021Input>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const egfr = ckdEpi2021.formula(inputs);
  const result = ckdEpi2021.interpret(egfr);

  function update<K extends keyof CkdEpi2021Input>(key: K, value: CkdEpi2021Input[K]) {
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
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="glass-panel space-y-6 p-6"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <NumberInput
            label={t("ckdEpi2021.fields.age")}
            value={inputs.age}
            onChange={(v) => update("age", v)}
            min={18}
            max={120}
          />
          <RadioGroup
            name="sex"
            legend={t("ckdEpi2021.fields.sex")}
            value={inputs.sex}
            onChange={(v) => update("sex", v)}
            options={[
              { value: "male", label: t("common.male") },
              { value: "female", label: t("common.female") },
            ]}
          />
          <NumberInput
            label={t("ckdEpi2021.fields.creatinine")}
            value={inputs.creatinine}
            onChange={(v) => update("creatinine", v)}
            min={0.1}
            max={20}
          />
        </div>

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {submitted && (
        <CkdEpiResultPanel
          mode={mode}
          egfr={egfr}
          stage={result.stage}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
        />
      )}
    </div>
  );
}

function CkdEpiResultPanel(props: {
  mode: Mode;
  egfr: number;
  stage: "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5";
  tier: "low" | "moderate" | "high";
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
}) {
  const t = useTranslations();
  const tierClass = tierStyles[props.tier];

  if (props.mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("ckdEpi2021.result_label")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-5xl font-semibold leading-none tabular-nums">
            {props.egfr}
          </span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${tierClass}`}>
            {t(`common.tier_${props.tier}` as "common.tier_low")}
          </span>
        </div>

        <p className="mt-5 text-slate-900 dark:text-slate-100">{props.recommendation}</p>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("ckdEpi2021.stage_label")}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {props.stage}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("common.evidence")}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {props.evidenceGrade}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  const resultKey = `ckdEpi2021.patient.result_${props.tier}` as const;
  const questions = t.raw("ckdEpi2021.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("ckdEpi2021.patient.intro")}</p>

      <div className={`rounded-lg px-4 py-3 ring-1 ${tierClass}`}>
        <p className="font-medium">{t(resultKey)}</p>
        <p className="mt-1 font-mono text-sm tabular-nums">
          {t("ckdEpi2021.result_label")}: <strong>{props.egfr}</strong> · {t("ckdEpi2021.stage_label")}: <strong>{props.stage}</strong>
        </p>
      </div>

      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("ckdEpi2021.patient.ask_doctor")}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {questionList.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>

      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        {t("common.disclaimer")}
      </p>
    </div>
  );
}
