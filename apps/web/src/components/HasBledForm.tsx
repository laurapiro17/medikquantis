"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { hasbled } from "@medcalc/calculators";

type HasBledInput = hasbled.HasBledInput;
type Mode = "clinician" | "patient";

const defaultInputs: HasBledInput = {
  age: 65,
  uncontrolledHypertension: false,
  abnormalRenalFunction: false,
  abnormalLiverFunction: false,
  strokeHistory: false,
  bleedingHistoryOrPredisposition: false,
  labileInr: false,
  drugsPredisposingToBleeding: false,
  alcoholExcess: false,
};

const booleanFields = [
  "uncontrolledHypertension",
  "abnormalRenalFunction",
  "abnormalLiverFunction",
  "strokeHistory",
  "bleedingHistoryOrPredisposition",
  "labileInr",
  "drugsPredisposingToBleeding",
  "alcoholExcess",
] as const;

export function HasBledForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<HasBledInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const score = hasbled.formula(inputs);
  const result = hasbled.interpret(score);

  function update<K extends keyof HasBledInput>(key: K, value: HasBledInput[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs(defaultInputs);
    setSubmitted(false);
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {(["clinician", "patient"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              mode === m
                ? "rounded-md bg-trust-600 px-4 py-1.5 text-sm font-medium text-white"
                : "rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            }
          >
            {t(`common.mode_${m}`)}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
      >
        <label className="block max-w-xs">
          <span className="block text-sm font-medium text-slate-700">
            {t("hasbled.fields.age")}
          </span>
          <input
            type="number"
            min={18}
            max={120}
            value={inputs.age}
            onChange={(e) => update("age", Number(e.target.value))}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="space-y-2">
          {booleanFields.map((field) => (
            <label key={field} className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={inputs[field]}
                onChange={(e) => update(field, e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-slate-700">
                {t(`hasbled.fields.${field}`)}
              </span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md bg-trust-600 px-4 py-2 text-sm font-medium text-white hover:bg-trust-700"
          >
            {t("common.calculate")}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t("common.reset")}
          </button>
        </div>
      </form>

      {submitted && (
        <ResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={result.recommendation}
          evidenceGrade={result.evidenceGrade}
          annualRiskPercent={result.annualRiskPercent}
        />
      )}
    </div>
  );
}

function ResultPanel(props: {
  mode: Mode;
  score: number;
  tier: "low" | "moderate" | "high";
  recommendation: string;
  evidenceGrade: "A" | "B" | "C";
  annualRiskPercent?: number;
}) {
  const t = useTranslations();
  const tierColor = {
    low: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    moderate: "bg-amber-100 text-amber-800 ring-amber-200",
    high: "bg-cardio-50 text-cardio-700 ring-cardio-200",
  }[props.tier];

  if (props.mode === "clinician") {
    return (
      <div className="animate-fade-in rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-medium text-slate-500">
            {t("common.score")}
          </span>
          <span className="text-4xl font-bold text-slate-900">{props.score}</span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${tierColor}`}>
            {t(`common.tier_${props.tier}`)}
          </span>
        </div>

        <p className="mt-4 text-slate-900">{props.recommendation}</p>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          {props.annualRiskPercent !== undefined && (
            <div>
              <dt className="text-slate-500">
                {t("common.annual_bleeding_risk")}
              </dt>
              <dd className="font-medium text-slate-900">
                {props.annualRiskPercent}%
              </dd>
            </div>
          )}
          <div>
            <dt className="text-slate-500">{t("common.evidence")}</dt>
            <dd className="font-medium text-slate-900">{props.evidenceGrade}</dd>
          </div>
        </dl>
      </div>
    );
  }

  const tierKey = `hasbled.patient.result_${props.tier}` as const;
  return (
    <div className="animate-fade-in space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <p className="text-slate-700">{t("hasbled.patient.intro")}</p>

      <div className={`rounded-md px-4 py-3 ring-1 ${tierColor}`}>
        <p className="font-medium">{t(tierKey)}</p>
        {props.annualRiskPercent !== undefined && (
          <p className="mt-1 text-sm">
            {t("common.annual_bleeding_risk")}: <strong>{props.annualRiskPercent}%</strong>
          </p>
        )}
      </div>

      <div>
        <p className="font-medium text-slate-900">
          {t("hasbled.patient.ask_doctor")}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {t.raw("hasbled.patient.questions") instanceof Array
            ? (t.raw("hasbled.patient.questions") as string[]).map((q, i) => (
                <li key={i}>{q}</li>
              ))
            : null}
        </ul>
      </div>

      <p className="text-xs text-slate-500">{t("common.disclaimer")}</p>
    </div>
  );
}
