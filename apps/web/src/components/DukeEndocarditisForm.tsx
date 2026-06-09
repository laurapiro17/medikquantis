"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { dukeEndocarditis } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { BooleanList, FormActions } from "./Field";

type DukeEndocarditisInput = dukeEndocarditis.DukeEndocarditisInput;
type Mode = "clinician" | "patient";

const defaultInputs: DukeEndocarditisInput = {
  majorBloodCultures: false,
  majorEndocardialInvolvement: false,
  minorPredisposition: false,
  minorFever: false,
  minorVascularPhenomena: false,
  minorImmunologicPhenomena: false,
  minorMicrobiologicEvidence: false,
};

const majorFields = ["majorBloodCultures", "majorEndocardialInvolvement"] as const;
const minorFields = [
  "minorPredisposition",
  "minorFever",
  "minorVascularPhenomena",
  "minorImmunologicPhenomena",
  "minorMicrobiologicEvidence",
] as const;

const categoryStyles = {
  definite:
    "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
  possible:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  rejected:
    "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
} as const;

export function DukeEndocarditisForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<DukeEndocarditisInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const score = dukeEndocarditis.formula(inputs);
  const result = dukeEndocarditis.interpret(score);

  function update<K extends keyof DukeEndocarditisInput>(
    key: K,
    value: DukeEndocarditisInput[K],
  ) {
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
        <fieldset className="space-y-2">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("dukeEndocarditis.major_heading")}
          </legend>
          <BooleanList
            items={majorFields.map((field) => ({
              key: field,
              label: t(`dukeEndocarditis.fields.${field}` as "dukeEndocarditis.fields.majorBloodCultures"),
              checked: inputs[field],
              onChange: (v) => update(field, v),
            }))}
          />
        </fieldset>
        <fieldset className="space-y-2 border-t border-slate-200 pt-4 dark:border-white/10">
          <legend className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("dukeEndocarditis.minor_heading")}
          </legend>
          <BooleanList
            items={minorFields.map((field) => ({
              key: field,
              label: t(`dukeEndocarditis.fields.${field}` as "dukeEndocarditis.fields.minorPredisposition"),
              checked: inputs[field],
              onChange: (v) => update(field, v),
            }))}
          />
        </fieldset>
        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>
      {submitted && (
        <>
          <DukeResultPanel
            mode={mode}
            category={result.category}
            majorCount={result.majorCount}
            minorCount={result.minorCount}
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

function DukeResultPanel({
  mode,
  category,
  majorCount,
  minorCount,
  recommendation,
  evidenceGrade,
}: {
  mode: Mode;
  category: "definite" | "possible" | "rejected";
  majorCount: number;
  minorCount: number;
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
            {t("dukeEndocarditis.diagnosis_label")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-3xl font-semibold leading-none">
            {t(`dukeEndocarditis.categories.${category}` as "dukeEndocarditis.categories.rejected")}
          </span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}>
            {majorCount}M · {minorCount}m
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

  const questions = t.raw("dukeEndocarditis.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];
  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">
        {t("dukeEndocarditis.patient.intro")}
      </p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">
          {t(`dukeEndocarditis.patient.result_${category}` as "dukeEndocarditis.patient.result_rejected")}
        </p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("dukeEndocarditis.patient.ask_doctor")}
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
