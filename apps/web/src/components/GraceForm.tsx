"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { grace } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { BooleanList, FormActions, NumberInput, RadioGroup } from "./Field";

type GraceInput = grace.GraceInput;
type KillipClassValue = grace.KillipClassValue;
type Mode = "clinician" | "patient";

const defaultInputs: GraceInput = {
  age: 65,
  heartRate: 80,
  systolicBP: 130,
  creatinine: 1.0,
  killipClass: "I",
  cardiacArrestAtAdmission: false,
  stSegmentDeviation: false,
  elevatedCardiacEnzymes: false,
};

const killipClasses: KillipClassValue[] = ["I", "II", "III", "IV"];

const booleanFields = [
  "cardiacArrestAtAdmission",
  "stSegmentDeviation",
  "elevatedCardiacEnzymes",
] as const;

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function GraceForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<GraceInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const [mode, setMode] = useState<Mode>("clinician");

  const score = grace.formula(inputs);
  const result = grace.interpret(score);

  function update<K extends keyof GraceInput>(key: K, value: GraceInput[K]) {
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
            label={t("grace.fields.age")}
            value={inputs.age}
            onChange={(v) => update("age", v)}
            min={18}
            max={120}
          />
          <NumberInput
            label={t("grace.fields.heartRate")}
            value={inputs.heartRate}
            onChange={(v) => update("heartRate", v)}
            min={20}
            max={300}
          />
          <NumberInput
            label={t("grace.fields.systolicBP")}
            value={inputs.systolicBP}
            onChange={(v) => update("systolicBP", v)}
            min={40}
            max={300}
          />
          <NumberInput
            label={t("grace.fields.creatinine")}
            value={inputs.creatinine}
            onChange={(v) => update("creatinine", v)}
            min={0.1}
            max={20}
          />
        </div>

        <div className="border-t border-slate-200 pt-5 dark:border-white/10">
          <RadioGroup
            name="killipClass"
            legend={t("grace.fields.killipClass.legend")}
            value={inputs.killipClass}
            onChange={(v) => update("killipClass", v as KillipClassValue)}
            layout="cards"
            options={killipClasses.map((cls) => ({
              value: cls,
              badge: cls,
              label: t(`grace.fields.killipClass.${cls}` as "grace.fields.killipClass.I"),
            }))}
          />
        </div>

        <BooleanList
          className="border-t border-slate-200 pt-5 dark:border-white/10"
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`grace.fields.${field}` as "grace.fields.cardiacArrestAtAdmission"),
            checked: inputs[field],
            onChange: (v) => update(field, v),
          }))}
        />

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      {submitted && (
        <>
          <GraceResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          mortality={result.annualRiskPercent}
        />
          <div className="glass-panel p-4">
            <ShareActions shareableInputs={inputs} tier={result.tier} mode={mode} />
          </div>
        </>
      )}
    </div>
  );
}

function GraceResultPanel(props: {
  mode: Mode;
  score: number;
  tier: "low" | "moderate" | "high";
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
  mortality?: number;
}) {
  const t = useTranslations();
  const tierClass = tierStyles[props.tier];

  if (props.mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("common.score")}
          </span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-6xl font-semibold leading-none tabular-nums">
            {props.score}
          </span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${tierClass}`}>
            {t(`common.tier_${props.tier}` as "common.tier_low")}
          </span>
        </div>

        <p className="mt-5 text-slate-900 dark:text-slate-100">{props.recommendation}</p>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          {props.mortality !== undefined && (
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t("grace.risk_label_inhospital")}
              </dt>
              <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums dark:text-slate-100">
                {props.mortality}%
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
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

  const resultKey = `grace.patient.result_${props.tier}` as const;
  const questions = t.raw("grace.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("grace.patient.intro")}</p>

      <div className={`rounded-lg px-4 py-3 ring-1 ${tierClass}`}>
        <p className="font-medium">{t(resultKey)}</p>
        {props.mortality !== undefined && (
          <p className="mt-1 font-mono text-sm tabular-nums">
            {t("grace.risk_label_inhospital")}: <strong>{props.mortality}%</strong>
          </p>
        )}
      </div>

      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("grace.patient.ask_doctor")}
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
