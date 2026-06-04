"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cha2ds2vasc } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";

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
      <ModeToggle mode={mode} onChange={setMode} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="glass-panel space-y-6 p-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("cha2ds2vasc.fields.age")}
            </span>
            <input
              type="number"
              min={18}
              max={120}
              value={inputs.age}
              onChange={(e) => update("age", Number(e.target.value))}
              className="input-underline mt-1 font-mono tabular-nums"
            />
          </label>

          <fieldset>
            <legend className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("cha2ds2vasc.fields.sex")}
            </legend>
            <div className="mt-3 flex gap-4">
              {(["male", "female"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="sex"
                    value={s}
                    checked={inputs.sex === s}
                    onChange={() => update("sex", s)}
                    className="text-trust-600 focus:ring-trust-600 dark:text-neon dark:focus:ring-neon"
                  />
                  {t(`common.${s}` as "common.male")}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="space-y-2.5 border-t border-slate-200 pt-5 dark:border-white/10">
          {booleanFields.map((field) => (
            <label key={field} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={inputs[field]}
                onChange={(e) => update(field, e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-trust-600 focus:ring-trust-600 dark:border-white/20 dark:bg-white/5 dark:text-neon dark:focus:ring-neon"
              />
              <span>{t(`cha2ds2vasc.fields.${field}` as "cha2ds2vasc.fields.chf")}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
          <button
            type="submit"
            className="rounded-md bg-trust-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-trust-700 dark:bg-neon dark:text-neon-ink dark:shadow-neon-soft dark:hover:bg-neon-soft"
          >
            {t("common.calculate")}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
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
          riskLabelKey="common.annual_risk"
          i18nNamespace="cha2ds2vasc"
        />
      )}
    </div>
  );
}
