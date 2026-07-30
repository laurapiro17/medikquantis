"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { BooleanList, FormActions, NumberInput, RadioGroup } from "./Field";
import type { AnyCalc, FieldUIMetadata } from "@medcalc/calculators";

type Mode = "clinician" | "patient";

interface DynamicCalcFormProps {
  calculator: AnyCalc;
  customDefaults?: Record<string, any>;
  riskLabelKey?: string;
}

export function DynamicCalcForm({
  calculator,
  customDefaults,
  riskLabelKey = "common.annual_risk",
}: DynamicCalcFormProps) {
  const t = useTranslations();
  const meta = calculator.fieldsMetadata as Record<string, FieldUIMetadata> | undefined;

  // Extract initial default inputs
  const defaultInputs = useMemo(() => {
    const defaults: Record<string, any> = { ...customDefaults };
    if (meta) {
      Object.entries(meta).forEach(([key, fMeta]) => {
        if (defaults[key] !== undefined) return;
        if (fMeta.defaultValue !== undefined) {
          defaults[key] = fMeta.defaultValue;
        } else if (fMeta.widget === "boolean") {
          defaults[key] = false;
        } else if (fMeta.widget === "number") {
          defaults[key] = fMeta.min ?? 0;
        } else if (fMeta.widget === "radio" && fMeta.options?.length) {
          defaults[key] = fMeta.options[0].value;
        }
      });
    }
    return defaults;
  }, [meta, customDefaults]);

  const [inputs, setInputs] = useState<Record<string, any>>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = useMemo(() => {
    try {
      return calculator.formula(inputs);
    } catch {
      return 0;
    }
  }, [calculator, inputs]);

  const result = useMemo(() => {
    try {
      return calculator.interpret(score, inputs);
    } catch {
      return {
        tier: "low" as const,
        recommendation: "",
        recommendationCode: "",
        evidenceGrade: "A" as const,
      };
    }
  }, [calculator, score, inputs]);

  function update(key: string, value: any) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs(defaultInputs);
  }

  // Categorize meta fields for rendering
  const numberFields: Array<{ key: string; meta: FieldUIMetadata }> = [];
  const radioFields: Array<{ key: string; meta: FieldUIMetadata }> = [];
  const booleanFields: Array<{ key: string; meta: FieldUIMetadata }> = [];

  if (meta) {
    Object.entries(meta).forEach(([key, fMeta]) => {
      if (fMeta.widget === "number") numberFields.push({ key, meta: fMeta });
      else if (fMeta.widget === "radio") radioFields.push({ key, meta: fMeta });
      else if (fMeta.widget === "boolean") booleanFields.push({ key, meta: fMeta });
    });
  }

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onChange={setMode} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="glass-panel space-y-6 p-6"
      >
        {/* Render Number and Radio fields in top grid */}
        {(numberFields.length > 0 || radioFields.length > 0) && (
          <div className="grid gap-6 sm:grid-cols-2">
            {numberFields.map(({ key, meta: fMeta }) => (
              <NumberInput
                key={key}
                label={t(`${calculator.i18nKey}.fields.${key}`)}
                value={inputs[key] ?? fMeta.min ?? 0}
                onChange={(v) => update(key, v)}
                min={fMeta.min}
                max={fMeta.max}
              />
            ))}

            {radioFields.map(({ key, meta: fMeta }) => (
              <RadioGroup
                key={key}
                name={key}
                legend={t(`${calculator.i18nKey}.fields.${key}`)}
                value={inputs[key] ?? null}
                onChange={(v) => update(key, v)}
                layout={fMeta.layout ?? "inline"}
                options={(fMeta.options || []).map((opt) => ({
                  value: opt.value,
                  badge: opt.badge,
                  label: opt.labelKey
                    ? t(opt.labelKey)
                    : t(`${calculator.i18nKey}.fields.${key}_${opt.value}`),
                }))}
              />
            ))}
          </div>
        )}

        {/* Render Boolean checkboxes in list below */}
        {booleanFields.length > 0 && (
          <BooleanList
            className={
              numberFields.length > 0 || radioFields.length > 0
                ? "border-t border-slate-200 pt-5 dark:border-white/10"
                : ""
            }
            items={booleanFields.map(({ key }) => ({
              key,
              label: t(`${calculator.i18nKey}.fields.${key}`),
              checked: Boolean(inputs[key]),
              onChange: (v) => update(key, v),
            }))}
          />
        )}

        <FormActions
          submitLabel={t("common.calculate")}
          resetLabel={t("common.reset")}
          onReset={reset}
        />
      </form>

      <ResultPanel
        mode={mode}
        score={score}
        tier={result.tier}
        recommendation={result.recommendation}
        evidenceGrade={result.evidenceGrade}
        annualRiskPercent={result.annualRiskPercent}
        riskLabelKey={riskLabelKey}
        i18nNamespace={calculator.i18nKey}
        shareableInputs={inputs}
      />
    </div>
  );
}
