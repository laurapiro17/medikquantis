import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// NYHA functional classification for heart failure (NYHA 1964,
// Diseases of the Heart and Blood Vessels, 6th ed.). Universally
// cited by every modern HF guideline (ESC HF 2021, PMID 34491061;
// ACC/AHA/HFSA HF 2022, PMID 35379503).

export const NyhaClass = z.enum(["I", "II", "III", "IV"]);
export type NyhaClassValue = z.infer<typeof NyhaClass>;

export const NyhaInputs = z.object({
  nyhaClass: NyhaClass,
});

export type NyhaInput = z.infer<typeof NyhaInputs>;

const ordinalByClass: Record<NyhaClassValue, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
};

export function formula(inputs: NyhaInput): number {
  return ordinalByClass[inputs.nyhaClass];
}

interface NyhaInterpretResult extends InterpretResult {
  classLabel: NyhaClassValue;
}

export function interpret(
  _score: number,
  inputs: NyhaInput,
): NyhaInterpretResult {
  const cls = inputs.nyhaClass;

  if (cls === "I") {
    return {
      classLabel: cls,
      tier: "low",
      recommendation:
        "No symptoms with ordinary activity; continue guideline-directed medical therapy if HFrEF.",
      evidenceGrade: "A",
    };
  }

  if (cls === "II") {
    return {
      classLabel: cls,
      tier: "moderate",
      recommendation:
        "Slight limitation with ordinary activity; ensure quadruple therapy (ARNI/ACEi + BB + MRA + SGLT2i) if HFrEF.",
      evidenceGrade: "A",
    };
  }

  if (cls === "III") {
    return {
      classLabel: cls,
      tier: "high",
      recommendation:
        "Marked limitation with less-than-ordinary activity; optimize therapy and consider CRT/ICD per LVEF and QRS.",
      evidenceGrade: "A",
    };
  }

  return {
    classLabel: cls,
    tier: "high",
    recommendation:
      "Symptoms at rest; refer for advanced HF therapies (LVAD, transplant evaluation) and palliative care discussion.",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof NyhaInputs> = {
  id: "nyha",
  inputs: NyhaInputs,
  formula,
  interpret: (score, inputs) => interpret(score, inputs),
  scoreRange: { min: 1, max: 4 },
  specialty: "cardiology",
  i18nKey: "nyha",
  references: [
    {
      pmid: "34491061",
      citation:
        "McDonagh TA, Metra M, Adamo M, et al. 2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2021;42(36):3599-3726.",
    },
    {
      pmid: "35379503",
      citation:
        "Heidenreich PA, Bozkurt B, Aguilar D, et al. 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure. J Am Coll Cardiol. 2022;79(17):e263-e421.",
    },
  ],
};
