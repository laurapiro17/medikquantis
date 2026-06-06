"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { das28 } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, NumberInput, RadioGroup } from "./Field";

type Das28Input = das28.Das28Input;
type Mode = "clinician" | "patient";

const defaultInputs: Das28Input = {
  markerType: "ESR",
  markerValue: 20,
  tenderJointCount28: 0,
  swollenJointCount28: 0,
  patientGlobalAssessment: 0,
};

const categoryStyles = {
  remission:
    "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function Das28Form() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Das28Input>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = das28.formula(inputs);
  const result = das28.interpret(score);

  function update<K extends keyof Das28Input>(key: K, value: Das28Input[K]) {
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
          name="das28-marker"
          legend={t("das28.fields.markerType")}
          value={inputs.markerType}
          onChange={(v) => update("markerType", v)}
          options={[
            { value: "ESR", label: t("das28.marker.ESR") },
            { value: "CRP", label: t("das28.marker.CRP") },
          ]}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput
            label={
              inputs.markerType === "ESR"
                ? t("das28.fields.markerValueESR")
                : t("das28.fields.markerValueCRP")
            }
            value={inputs.markerValue}
            onChange={(v) => update("markerValue", v)}
            min={0}
            max={150}
          />
          <NumberInput
            label={t("das28.fields.patientGlobalAssessment")}
            value={inputs.patientGlobalAssessment}
            onChange={(v) => update("patientGlobalAssessment", v)}
            min={0}
            max={100}
          />
          <NumberInput
            label={t("das28.fields.tenderJointCount28")}
            value={inputs.tenderJointCount28}
            onChange={(v) => update("tenderJointCount28", v)}
            min={0}
            max={28}
          />
          <NumberInput
            label={t("das28.fields.swollenJointCount28")}
            value={inputs.swollenJointCount28}
            onChange={(v) => update("swollenJointCount28", v)}
            min={0}
            max={28}
          />
        </div>
        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>
      {submitted && (
        <>
          <Das28ResultPanel
            mode={mode}
            score={score}
            category={result.category}
            recommendation={result.recommendation}
            evidenceGrade={result.evidenceGrade}
          />
          <div className="glass-panel p-4">
            <ShareActions
              shareableInputs={inputs}
              tier={result.tier}
              mode={mode}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Das28ResultPanel({
  mode,
  score,
  category,
  recommendation,
  evidenceGrade,
}: {
  mode: Mode;
  score: number;
  category: "remission" | "low" | "moderate" | "high";
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
}) {
  const t = useTranslations();
  const style = categoryStyles[category];

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            DAS28
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-6xl font-semibold leading-none tabular-nums">
            {score.toFixed(2)}
          </span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}>
            {t(`das28.categories.${category}` as "das28.categories.low")}
          </span>
        </div>
        <p className="mt-5 text-slate-900 dark:text-slate-100">{recommendation}</p>
        <dl className="mt-5 grid gap-4 text-sm">
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
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

  const questions = t.raw("das28.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("das28.patient.intro")}</p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">
          {t(`das28.patient.result_${category}` as "das28.patient.result_low")}
        </p>
        <p className="mt-1 font-mono text-sm">
          DAS28: <strong>{score.toFixed(2)}</strong>
        </p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("das28.patient.ask_doctor")}
        </p>
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
