"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { ascvd } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { BooleanList, FormActions, NumberInput, RadioGroup } from "./Field";

type AscvdInput = ascvd.AscvdInput;
type Mode = "clinician" | "patient";

const defaultInputs: AscvdInput = {
  sex: "male", race: "white_or_other", age: 55,
  totalCholesterolMgDl: 200, hdlMgDl: 50,
  systolicBpMmHg: 130, treatedForHypertension: false,
  diabetes: false, smoker: false,
};

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

const booleanFields = [
  "treatedForHypertension", "diabetes", "smoker",
] as const;

export function AscvdForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<AscvdInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const value = ascvd.formula(inputs);
  const result = ascvd.interpret(value);

  function update<K extends keyof AscvdInput>(key: K, value: AscvdInput[K]) {
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
          name="ascvd-sex"
          legend={t("ascvd.fields.sex")}
          value={inputs.sex}
          onChange={(v) => update("sex", v)}
          options={[
            { value: "male", label: t("common.male") },
            { value: "female", label: t("common.female") },
          ]}
        />
        <RadioGroup
          name="ascvd-race"
          legend={t("ascvd.fields.race")}
          value={inputs.race}
          onChange={(v) => update("race", v)}
          options={[
            { value: "white_or_other", label: t("ascvd.race_options.white_or_other") },
            { value: "african_american", label: t("ascvd.race_options.african_american") },
          ]}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput label={t("ascvd.fields.age")} value={inputs.age} onChange={(v) => update("age", v)} min={40} max={79} />
          <NumberInput label={t("ascvd.fields.systolicBpMmHg")} value={inputs.systolicBpMmHg} onChange={(v) => update("systolicBpMmHg", v)} min={80} max={220} />
          <NumberInput label={t("ascvd.fields.totalCholesterolMgDl")} value={inputs.totalCholesterolMgDl} onChange={(v) => update("totalCholesterolMgDl", v)} min={50} max={500} />
          <NumberInput label={t("ascvd.fields.hdlMgDl")} value={inputs.hdlMgDl} onChange={(v) => update("hdlMgDl", v)} min={10} max={150} />
        </div>
        <BooleanList
          items={booleanFields.map((field) => ({
            key: field,
            label: t(`ascvd.fields.${field}` as "ascvd.fields.treatedForHypertension"),
            checked: inputs[field],
            onChange: (v) => update(field, v),
          }))}
        />
        <FormActions submitLabel={t("common.calculate")} resetLabel={t("common.reset")} onReset={reset} />
      </form>
      {submitted && (
        <>
          <AscvdResultPanel mode={mode} value={value} tier={result.tier} recommendation={result.recommendation} evidenceGrade={result.evidenceGrade} />
          <div className="glass-panel p-4">
            <ShareActions shareableInputs={inputs} tier={result.tier} mode={mode} />
          </div>
        </>
      )}
    </div>
  );
}

function AscvdResultPanel({
  mode, value, tier, recommendation, evidenceGrade,
}: {
  mode: Mode; value: number; tier: "low" | "moderate" | "high";
  recommendation: string; evidenceGrade: "A" | "B" | "C";
}) {
  const t = useTranslations();
  const style = tierStyles[tier];

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">ASCVD</span>
          <span className="score-glow-light dark:score-glow-dark font-mono text-5xl font-semibold leading-none tabular-nums">
            {value.toFixed(1)}
          </span>
          <span className="font-mono text-sm text-slate-500 dark:text-slate-400">% / 10 yr</span>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ring-1 ${style}`}>
            {t(`common.tier_${tier}` as "common.tier_low")}
          </span>
        </div>
        <p className="mt-5 text-slate-900 dark:text-slate-100">{recommendation}</p>
        <dl className="mt-5 grid gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("common.evidence")}</dt>
            <dd className="mt-1 font-mono text-2xl font-medium text-slate-900 dark:text-slate-100">{evidenceGrade}</dd>
          </div>
        </dl>
      </div>
    );
  }

  const questions = t.raw("ascvd.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];
  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("ascvd.patient.intro")}</p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">{t(`ascvd.patient.result_${tier}` as "ascvd.patient.result_low")}</p>
        <p className="mt-1 font-mono text-sm">ASCVD: <strong>{value.toFixed(1)} %</strong></p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{t("ascvd.patient.ask_doctor")}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {questionList.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </div>
      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">{t("common.disclaimer")}</p>
    </div>
  );
}
