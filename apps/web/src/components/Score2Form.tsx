"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { score2 } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { BooleanList, FormActions, NumberInput, RadioGroup } from "./Field";

type Score2Input = score2.Score2Input;
type Mode = "clinician" | "patient";

const defaultInputs: Score2Input = {
  sex: "male", age: 55, smoker: false,
  systolicBpMmHg: 130, totalCholesterolMmolL: 5.0, hdlMmolL: 1.3,
};

const tierStyles = {
  low: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  high: "bg-cardio-50 text-cardio-700 ring-cardio-200 dark:bg-cardio-500/10 dark:text-cardio-500 dark:ring-cardio-500/30",
} as const;

export function Score2Form() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<Score2Input>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const value = score2.formula(inputs);
  const result = score2.interpret(value, inputs);
  const isOp = inputs.age >= 70;

  function update<K extends keyof Score2Input>(key: K, value: Score2Input[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }
  function reset() {
    setInputs(defaultInputs);
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {t("score2.region_note")}
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); }}
        className="glass-panel space-y-6 p-6"
      >
        <RadioGroup
          name="score2-sex"
          legend={t("score2.fields.sex")}
          value={inputs.sex}
          onChange={(v) => update("sex", v)}
          options={[
            { value: "male", label: t("common.male") },
            { value: "female", label: t("common.female") },
          ]}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput label={t("score2.fields.age")} value={inputs.age} onChange={(v) => update("age", v)} min={40} max={89} />
          <NumberInput label={t("score2.fields.systolicBpMmHg")} value={inputs.systolicBpMmHg} onChange={(v) => update("systolicBpMmHg", v)} min={80} max={220} />
          <NumberInput label={t("score2.fields.totalCholesterolMmolL")} value={inputs.totalCholesterolMmolL} onChange={(v) => update("totalCholesterolMmolL", v)} min={2} max={15} />
          <NumberInput label={t("score2.fields.hdlMmolL")} value={inputs.hdlMmolL} onChange={(v) => update("hdlMmolL", v)} min={0.4} max={3.5} />
        </div>
        <BooleanList items={[{ key: "smoker", label: t("score2.fields.smoker"), checked: inputs.smoker, onChange: (v) => update("smoker", v) }]} />
        <FormActions submitLabel={t("common.calculate")} resetLabel={t("common.reset")} onReset={reset} />
      </form>
      {(
        <>
          <Score2ResultPanel mode={mode} value={value} tier={result.tier} isOp={isOp} recommendation={result.recommendation} evidenceGrade={result.evidenceGrade} />
          <div className="glass-panel p-4">
            <ShareActions shareableInputs={inputs} tier={result.tier} mode={mode} />
          </div>
        </>
      )}
    </div>
  );
}

function Score2ResultPanel({
  mode, value, tier, isOp, recommendation, evidenceGrade,
}: {
  mode: Mode; value: number; tier: "low" | "moderate" | "high"; isOp: boolean;
  recommendation: string; evidenceGrade: "A" | "B" | "C";
}) {
  const t = useTranslations();
  const style = tierStyles[tier];

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <div className="flex items-baseline gap-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isOp ? "SCORE2-OP" : "SCORE2"}
          </span>
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

  const questions = t.raw("score2.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];
  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">{t("score2.patient.intro")}</p>
      <div className={`rounded-lg px-4 py-3 ring-1 ${style}`}>
        <p className="font-medium">{t(`score2.patient.result_${tier}` as "score2.patient.result_low")}</p>
        <p className="mt-1 font-mono text-sm">{t("score2.result_label")}: <strong>{value.toFixed(1)} %</strong></p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">{t("score2.patient.ask_doctor")}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {questionList.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </div>
      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">{t("common.disclaimer")}</p>
    </div>
  );
}
