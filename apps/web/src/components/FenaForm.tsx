"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { fena } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, NumberInput } from "./Field";

type FenaInput = fena.FenaInput;
type Mode = "clinician" | "patient";

const defaultInputs: FenaInput = {
  urineSodiumMEqL: 40,
  plasmaSodiumMEqL: 140,
  urineCreatinineMgDl: 80,
  plasmaCreatinineMgDl: 1.0,
};

const categoryStyles = {
  prerenal:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  indeterminate:
    "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-white/5 dark:text-slate-300 dark:ring-white/20",
  intrinsic:
    "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function FenaForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<FenaInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const value = fena.formula(inputs);
  const result = fena.interpret(value);

  function update<K extends keyof FenaInput>(key: K, value: FenaInput[K]) {
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
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput
            label={t("fena.fields.urineSodiumMEqL")}
            value={inputs.urineSodiumMEqL}
            onChange={(v) => update("urineSodiumMEqL", v)}
            min={0}
            max={300}
          />
          <NumberInput
            label={t("fena.fields.plasmaSodiumMEqL")}
            value={inputs.plasmaSodiumMEqL}
            onChange={(v) => update("plasmaSodiumMEqL", v)}
            min={100}
            max={180}
          />
          <NumberInput
            label={t("fena.fields.urineCreatinineMgDl")}
            value={inputs.urineCreatinineMgDl}
            onChange={(v) => update("urineCreatinineMgDl", v)}
            min={0.1}
            max={500}
          />
          <NumberInput
            label={t("fena.fields.plasmaCreatinineMgDl")}
            value={inputs.plasmaCreatinineMgDl}
            onChange={(v) => update("plasmaCreatinineMgDl", v)}
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
        <>
          <FenaResultPanel
            mode={mode}
            value={value}
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

function FenaResultPanel({
  mode,
  value,
  category,
  recommendation,
  evidenceGrade,
}: {
  mode: Mode;
  value: number;
  category: "prerenal" | "indeterminate" | "intrinsic";
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
}) {
  const t = useTranslations();
  const style = categoryStyles[category];

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            FENa
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-5xl font-semibold leading-none tabular-nums">
            {value.toFixed(2)}
          </span>
          <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
            %
          </span>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}
          >
            {t(`fena.categories.${category}` as "fena.categories.prerenal")}
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

  const resultKey = `fena.patient.result_${category}` as const;
  const questions = t.raw("fena.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("fena.patient.intro")}</p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">{t(resultKey)}</p>
        <p className="mt-1 font-mono text-sm">FENa: <strong>{value.toFixed(2)} %</strong></p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("fena.patient.ask_doctor")}
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
