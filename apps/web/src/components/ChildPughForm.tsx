"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { childPugh } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, RadioGroup } from "./Field";

type ChildPughInput = childPugh.ChildPughInput;
type Mode = "clinician" | "patient";

const defaultInputs: ChildPughInput = {
  bilirubin: "1", albumin: "1", inr: "1", ascites: "1", encephalopathy: "1",
};

const fields = ["bilirubin", "albumin", "inr", "ascites", "encephalopathy"] as const;
const values = ["1", "2", "3"] as const;

const classStyles = {
  A: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  B: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  C: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function ChildPughForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<ChildPughInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = childPugh.formula(inputs);
  const result = childPugh.interpret(score);

  function update<K extends keyof ChildPughInput>(key: K, value: ChildPughInput[K]) {
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
        {fields.map((f) => (
          <RadioGroup
            key={f}
            name={`childpugh-${f}`}
            legend={t(`childPugh.fields.${f}` as "childPugh.fields.bilirubin")}
            value={inputs[f]}
            onChange={(v) => update(f, v as ChildPughInput[typeof f])}
            layout="cards"
            options={values.map((v) => ({
              value: v,
              badge: v,
              label: t(`childPugh.${f}_options.${v}` as "childPugh.bilirubin_options.1"),
            }))}
          />
        ))}
        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>
      {(
        <>
          <ChildPughResultPanel
            mode={mode}
            score={score}
            classLabel={result.classLabel}
            tier={result.tier}
            recommendation={result.recommendation}
            evidenceGrade={result.evidenceGrade}
          />
          <div className="glass-panel p-4">
            <ShareActions shareableInputs={inputs} tier={result.tier} mode={mode} />
          </div>
        </>
      )}
    </div>
  );
}

function ChildPughResultPanel({
  mode, score, classLabel, tier, recommendation, evidenceGrade,
}: {
  mode: Mode; score: number; classLabel: "A" | "B" | "C";
  tier: "low" | "moderate" | "high"; recommendation: string;
  evidenceGrade: "A" | "B" | "C";
}) {
  const t = useTranslations();
  const style = classStyles[classLabel];

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("childPugh.result_label")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-6xl font-semibold leading-none tabular-nums">
            {score}
          </span>
          <span className="font-mono text-xl text-slate-500 dark:text-slate-400">
            ({classLabel})
          </span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}>
            {t(`common.tier_${tier}` as "common.tier_low")}
          </span>
        </div>
        <p className="mt-5 text-slate-900 dark:text-slate-100">{recommendation}</p>
        <dl className="mt-5 grid gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t("common.evidence")}
            </dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 dark:text-slate-100">
              {evidenceGrade}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  const questions = t.raw("childPugh.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];
  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("childPugh.patient.intro")}</p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">{t(`childPugh.patient.result_${tier}` as "childPugh.patient.result_low")}</p>
        <p className="mt-1 font-mono text-sm">
          {t("childPugh.result_label")}: <strong>{score} ({classLabel})</strong>
        </p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{t("childPugh.patient.ask_doctor")}</p>
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
