"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ybocs } from "@medcalc/calculators";
import { FieldLegend, FormActions } from "./Field";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { useUrlInputs } from "./useUrlInputs";

const fields = ["obsessions", "compulsions"] as const;
const emptyInputs = { obsessions: "", compulsions: "" };

export function YbocsForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState(emptyInputs);
  const [mode, setMode] = useState<"clinician" | "patient">("clinician");
  const urlInputs = useUrlInputs();

  useEffect(() => {
    if (!urlInputs) return;
    const parsed = ybocs.YbocsInputs.safeParse(urlInputs);
    if (parsed.success) {
      setInputs({
        obsessions: String(parsed.data.obsessions),
        compulsions: String(parsed.data.compulsions),
      });
    }
  }, [urlInputs]);

  const parsed = ybocs.YbocsInputs.safeParse({
    obsessions: inputs.obsessions === "" ? undefined : Number(inputs.obsessions),
    compulsions: inputs.compulsions === "" ? undefined : Number(inputs.compulsions),
  });
  const score = parsed.success ? ybocs.formula(parsed.data) : null;
  const result = score === null ? null : ybocs.interpret(score);
  const invalid = fields.some((key) =>
    inputs[key] !== "" && !ybocs.YbocsInputs.shape[key].safeParse(Number(inputs[key])).success
  );

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />
      <form onSubmit={(event) => event.preventDefault()} className="glass-panel space-y-6 p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map((key) => {
            const fieldInvalid = inputs[key] !== "" &&
              !ybocs.YbocsInputs.shape[key].safeParse(Number(inputs[key])).success;
            return (
              <label key={key} className="block">
                <FieldLegend>{t(`ybocs.fields.${key}`)}</FieldLegend>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={1}
                  required
                  value={inputs[key]}
                  aria-invalid={fieldInvalid}
                  aria-describedby={fieldInvalid ? "ybocs-input-error" : undefined}
                  onChange={(event) => setInputs((previous) => ({
                    ...previous,
                    [key]: event.target.value,
                  }))}
                  className="input-underline mt-1 font-mono tabular-nums"
                />
              </label>
            );
          })}
        </div>
        {invalid && (
          <p id="ybocs-input-error" role="alert" className="text-sm text-red-700 dark:text-red-300">
            {t("ybocs.validation")}
          </p>
        )}
        <FormActions resetLabel={t("common.reset")} onReset={() => setInputs(emptyInputs)} />
      </form>
      {result && score !== null && parsed.success && (
        <ResultPanel
          mode={mode}
          score={score}
          tier={result.tier}
          recommendation={t(`ybocs.recommendations.${result.recommendationCode}`)}
          evidenceGrade={result.evidenceGrade}
          i18nNamespace="ybocs"
          shareableInputs={parsed.data}
          scoreRange={ybocs.calculator.scoreRange}
        />
      )}
    </div>
  );
}
