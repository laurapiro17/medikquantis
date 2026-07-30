"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUrlInputs } from "./useUrlInputs";
import { cockcroftGault } from "@medcalc/calculators";
import { ModeToggle, ResultPanel } from "./ResultPanel";
import { FormActions, NumberInput, RadioGroup } from "./Field";

type CockcroftGaultInput = cockcroftGault.CockcroftGaultInput;
type Mode = "clinician" | "patient";

const defaultInputs: CockcroftGaultInput = {
  age: 65,
  sex: "male",
  weight: 70,
  creatinine: 1.0,
};

export function CockcroftGaultForm() {
  const t = useTranslations();
  const [inputs, setInputs] = useState<CockcroftGaultInput>(defaultInputs);
  const [mode, setMode] = useState<Mode>("clinician");

  const urlInputs = useUrlInputs();
  useEffect(() => {
    if (!urlInputs) return;
    setInputs((prev) => ({ ...prev, ...urlInputs }));
  }, [urlInputs]);

  const score = cockcroftGault.formula(inputs);
  const result = cockcroftGault.interpret(score);

  function update<K extends keyof CockcroftGaultInput>(
    key: K,
    value: CockcroftGaultInput[K]
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setInputs(defaultInputs);
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
        <RadioGroup
          name="cg-sex"
          legend={t("cockcroftGault.fields.sex")}
          value={inputs.sex}
          onChange={(v) => update("sex", v as "male" | "female")}
          options={[
            { value: "male", label: t("common.male") },
            { value: "female", label: t("common.female") },
          ]}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <NumberInput
            label={t("cockcroftGault.fields.age")}
            value={inputs.age}
            onChange={(v) => update("age", v)}
            min={18}
            max={120}
          />
          <NumberInput
            label={t("cockcroftGault.fields.weight")}
            value={inputs.weight}
            onChange={(v) => update("weight", v)}
            min={30}
            max={250}
          />
          <NumberInput
            label={t("cockcroftGault.fields.creatinine")}
            value={inputs.creatinine}
            onChange={(v) => update("creatinine", v)}
            min={0.2}
            max={15}
            step={0.1}
          />
        </div>

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
        i18nNamespace="cockcroftGault"
        shareableInputs={inputs}
        unit="mL/min"
      />
    </div>
  );
}
