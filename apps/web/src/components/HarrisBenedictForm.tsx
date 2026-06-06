"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { harrisBenedict } from "@medcalc/calculators";
import { ModeToggle } from "./ResultPanel";
import { ShareActions } from "./ShareActions";
import { FormActions, NumberInput, RadioGroup } from "./Field";
import { useUrlInputs } from "./useUrlInputs";

type HarrisBenedictInput = harrisBenedict.HarrisBenedictInput;
type ActivityLevelValue = harrisBenedict.ActivityLevelValue;
type Mode = "clinician" | "patient";

const defaultInputs: HarrisBenedictInput = {
  sex: "female",
  weightKg: 60,
  heightCm: 165,
  ageYears: 30,
  activityLevel: "moderate",
};

const activityLevels: ActivityLevelValue[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
];

export function HarrisBenedictForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<HarrisBenedictInput>(defaultInputs);
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
    setSubmitted(true);
  }, [urlInputs]);

  const bmr = harrisBenedict.formula(inputs);
  const result = harrisBenedict.interpret(bmr, inputs);

  function update<K extends keyof HarrisBenedictInput>(
    key: K,
    value: HarrisBenedictInput[K],
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
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="glass-panel space-y-6 p-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <RadioGroup
            name="hb-sex"
            legend={t("harrisBenedict.fields.sex")}
            value={inputs.sex}
            onChange={(v) => update("sex", v)}
            options={[
              { value: "male", label: t("common.male") },
              { value: "female", label: t("common.female") },
            ]}
          />
          <NumberInput
            label={t("harrisBenedict.fields.ageYears")}
            value={inputs.ageYears}
            onChange={(v) => update("ageYears", v)}
            min={18}
            max={120}
          />
          <NumberInput
            label={t("harrisBenedict.fields.weightKg")}
            value={inputs.weightKg}
            onChange={(v) => update("weightKg", v)}
            min={20}
            max={300}
          />
          <NumberInput
            label={t("harrisBenedict.fields.heightCm")}
            value={inputs.heightCm}
            onChange={(v) => update("heightCm", v)}
            min={100}
            max={250}
          />
        </div>

        <RadioGroup
          name="hb-activity"
          legend={t("harrisBenedict.fields.activityLevel")}
          value={inputs.activityLevel}
          onChange={(v) => update("activityLevel", v)}
          options={activityLevels.map((al) => ({
            value: al,
            label: t(`harrisBenedict.activity.${al}` as
              "harrisBenedict.activity.moderate"),
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
          <HarrisBenedictResultPanel
            mode={mode}
            bmr={result.bmrKcal}
            tdee={result.tdeeKcal}
            factor={result.activityFactor}
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

function HarrisBenedictResultPanel({
  mode,
  bmr,
  tdee,
  factor,
  evidenceGrade,
}: {
  mode: Mode;
  bmr: number;
  tdee: number;
  factor: number;
  evidenceGrade: "A" | "B" | "C";
}) {
  const t = useTranslations();

  if (mode === "clinician") {
    return (
      <div className="glass-panel animate-fade-in p-6">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("harrisBenedict.result_bmr")}
            </dt>
            <dd className="mt-1 score-glow-light dark:score-glow-dark font-mono text-5xl font-semibold leading-none tabular-nums">
              {bmr}
              <span className="ml-2 font-mono text-sm text-slate-500 dark:text-slate-400">
                kcal/day
              </span>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("harrisBenedict.result_tdee")}
            </dt>
            <dd className="mt-1 font-mono text-5xl font-semibold leading-none text-slate-900 tabular-nums dark:text-slate-100">
              {tdee}
              <span className="ml-2 font-mono text-sm text-slate-500 dark:text-slate-400">
                kcal/day
              </span>
            </dd>
          </div>
        </dl>
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          {t("harrisBenedict.activity_factor_label")}: ×{factor.toFixed(3)}
        </p>
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

  const questions = t.raw("harrisBenedict.patient.questions");
  const questionList = Array.isArray(questions) ? (questions as string[]) : [];

  return (
    <div className="glass-panel animate-fade-in space-y-5 p-6">
      <p className="text-slate-700 dark:text-slate-300">
        {t("harrisBenedict.patient.intro")}
      </p>
      <div className="rounded-lg border border-trust-200 bg-trust-50 px-4 py-3 dark:border-neon/30 dark:bg-white/5">
        <p className="font-medium">
          {t("harrisBenedict.patient.estimate_intro")}
        </p>
        <p className="mt-1 font-mono text-sm">
          {t("harrisBenedict.result_bmr")}: <strong>{bmr} kcal/day</strong>
        </p>
        <p className="mt-1 font-mono text-sm">
          {t("harrisBenedict.result_tdee")}: <strong>{tdee} kcal/day</strong>
        </p>
      </div>
      <div>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {t("harrisBenedict.patient.ask_doctor")}
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
