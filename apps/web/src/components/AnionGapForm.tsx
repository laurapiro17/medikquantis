"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { anionGap } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, NumberInput } from "./Field";

type AnionGapInput = anionGap.AnionGapInput;
type Mode = "clinician" | "patient";

const defaultInputs: AnionGapInput = {
  sodiumMEqL: 140,
  chlorideMEqL: 105,
  bicarbonateMEqL: 24,
};

const categoryStyles = {
  low: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  normal:
    "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  elevated:
    "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function AnionGapForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<AnionGapInput>(defaultInputs);
  const [useAlbumin, setUseAlbumin] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    if (urlInputs.albuminGDl !== undefined) setUseAlbumin(true);
    setSubmitted(true);
  }, [urlInputs]);

  const effectiveInputs: AnionGapInput = useAlbumin
    ? inputs
    : (() => {
        const { albuminGDl: _ignored, ...rest } = inputs;
        return rest as AnionGapInput;
      })();
  const score = anionGap.formula(effectiveInputs);
  const result = anionGap.interpret(score);

  function update<K extends keyof AnionGapInput>(
    key: K,
    value: AnionGapInput[K],
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs(defaultInputs);
    setUseAlbumin(false);
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
            label={t("anionGap.fields.sodiumMEqL")}
            value={inputs.sodiumMEqL}
            onChange={(v) => update("sodiumMEqL", v)}
            min={100}
            max={180}
          />
          <NumberInput
            label={t("anionGap.fields.chlorideMEqL")}
            value={inputs.chlorideMEqL}
            onChange={(v) => update("chlorideMEqL", v)}
            min={50}
            max={140}
          />
          <NumberInput
            label={t("anionGap.fields.bicarbonateMEqL")}
            value={inputs.bicarbonateMEqL}
            onChange={(v) => update("bicarbonateMEqL", v)}
            min={0}
            max={50}
          />
        </div>

        <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-white/10">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={useAlbumin}
              onChange={(e) => setUseAlbumin(e.target.checked)}
              className="rounded border-slate-300 text-trust-600 focus:ring-trust-500"
            />
            {t("anionGap.use_albumin_correction")}
          </label>
          {useAlbumin && (
            <NumberInput
              label={t("anionGap.fields.albuminGDl")}
              value={inputs.albuminGDl ?? 4.0}
              onChange={(v) => update("albuminGDl", v)}
              min={0.5}
              max={8}
            />
          )}
        </div>

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {submitted && (
        <>
          <AnionGapResultPanel
            mode={mode}
            value={score}
            category={result.category}
            recommendation={result.recommendation}
            evidenceGrade={result.evidenceGrade}
          />
          <div className="glass-panel p-4">
            <ShareActions
              shareableInputs={effectiveInputs}
              tier={result.tier}
              mode={mode}
            />
          </div>
        </>
      )}
    </div>
  );
}

function AnionGapResultPanel({
  mode,
  value,
  category,
  recommendation,
  evidenceGrade,
}: {
  mode: Mode;
  value: number;
  category: "low" | "normal" | "elevated";
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
            {t("anionGap.result_label")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-5xl font-semibold leading-none tabular-nums">
            {value.toFixed(1)}
          </span>
          <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
            mEq/L
          </span>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}
          >
            {t(`anionGap.categories.${category}` as
              "anionGap.categories.normal")}
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

  const resultKey = `anionGap.patient.result_${category}` as const;
  const questions = t.raw("anionGap.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">
        {t("anionGap.patient.intro")}
      </p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">{t(resultKey)}</p>
        <p className="mt-1 font-mono text-sm">
          {t("anionGap.result_label")}: <strong>{value.toFixed(1)} mEq/L</strong>
        </p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("anionGap.patient.ask_doctor")}
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
