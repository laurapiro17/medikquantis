"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cha2ds2vasc } from "@medcalc/calculators";

type Cha2ds2vascInput = cha2ds2vasc.Cha2ds2vascInput;
type Mode = "clinician" | "patient";

const defaultInputs: Cha2ds2vascInput = {
  age: 65,
  sex: "male",
  chf: false,
  hypertension: false,
  diabetes: false,
  strokeOrTia: false,
  vascularDisease: false,
};

const booleanFields = [
  "chf",
  "hypertension",
  "diabetes",
  "strokeOrTia",
  "vascularDisease",
] as const;

export function Cha2ds2vascForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Cha2ds2vascInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const score = cha2ds2vasc.formula(inputs);
  const result = cha2ds2vasc.interpret(score, inputs);

  function update<K extends keyof Cha2ds2vascInput>(key: K, value: Cha2ds2vascInput[K]) {
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
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700">
              {t("cha2ds2vasc.fields.age")}
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

          <fieldset>
            <legend className="block text-sm font-medium text-slate-700">
              {t("cha2ds2vasc.fields.sex")}
            </legend>
            <div className="mt-1 flex gap-3">
              {(["male", "female"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="sex"
                    value={s}
                    checked={inputs.sex === s}
                    onChange={() => update("sex", s)}
                  />
                  {t(`common.${s}`)}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="space-y-2">
          {booleanFields.map((field) => (
            <label key={field} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={inputs[field]}
                onChange={(e) => update(field, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-slate-700">
                {t(`cha2ds2vasc.fields.${field}`)}
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
        <ResultPanel mode={mode} score={score} tier={result.tier}
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
              <dt className="text-slate-500">{t("common.annual_risk")}</dt>
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

  // Patient mode
  const tierKey = `cha2ds2vasc.patient.result_${props.tier}` as const;
  return (
    <div className="animate-fade-in space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <p className="text-slate-700">{t("cha2ds2vasc.patient.intro")}</p>

      <div className={`rounded-md px-4 py-3 ring-1 ${tierColor}`}>
        <p className="font-medium">{t(tierKey)}</p>
        {props.annualRiskPercent !== undefined && (
          <p className="mt-1 text-sm">
            {t("common.annual_risk")}: <strong>{props.annualRiskPercent}%</strong>
          </p>
        )}
      </div>

      <div>
        <p className="font-medium text-slate-900">
          {t("cha2ds2vasc.patient.ask_doctor")}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {t.raw("cha2ds2vasc.patient.questions") instanceof Array
            ? (t.raw("cha2ds2vasc.patient.questions") as string[]).map((q, i) => (
                <li key={i}>{q}</li>
              ))
            : null}
        </ul>
      </div>

      <p className="text-xs text-slate-500">{t("common.disclaimer")}</p>
    </div>
  );
}
