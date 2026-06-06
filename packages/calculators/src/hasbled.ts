import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

export const HasBledInputs = z.object({
  age: z.number().int().min(18).max(120),
  uncontrolledHypertension: z.boolean(),
  abnormalRenalFunction: z.boolean(),
  abnormalLiverFunction: z.boolean(),
  strokeHistory: z.boolean(),
  bleedingHistoryOrPredisposition: z.boolean(),
  labileInr: z.boolean(),
  drugsPredisposingToBleeding: z.boolean(),
  alcoholExcess: z.boolean(),
});

export type HasBledInput = z.infer<typeof HasBledInputs>;

export function formula(inputs: HasBledInput): number {
  let score = 0;
  if (inputs.uncontrolledHypertension) score += 1;
  if (inputs.abnormalRenalFunction) score += 1;
  if (inputs.abnormalLiverFunction) score += 1;
  if (inputs.strokeHistory) score += 1;
  if (inputs.bleedingHistoryOrPredisposition) score += 1;
  if (inputs.labileInr) score += 1;
  if (inputs.age > 65) score += 1;
  if (inputs.drugsPredisposingToBleeding) score += 1;
  if (inputs.alcoholExcess) score += 1;
  return score;
}

// Bleeding risk per Pisters et al. 2010 derivation cohort (PMID 21111555).
// Major-bleeding rate per 100 patient-years.
const annualRiskByScore: Record<number, number> = {
  0: 1.13,
  1: 1.02,
  2: 1.88,
  3: 3.74,
  4: 8.7,
  5: 12.5,
  6: 12.5,
  7: 12.5,
  8: 12.5,
  9: 12.5,
};

export function interpret(score: number): InterpretResult {
  const annualRiskPercent = annualRiskByScore[score];

  if (score <= 2) {
    return {
      tier: "low",
      recommendation: "Low bleeding risk; anticoagulation is not precluded.",
      recommendationCode: "HASBLED_LOW_OAC_OK",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }

  // Score ≥3 = high bleeding risk. ESC: not a contraindication for OAC,
  // but a flag for closer monitoring and addressing reversible risk factors.
  if (score === 3) {
    return {
      tier: "moderate",
      recommendation:
        "Elevated bleeding risk — review reversible factors, monitor closely.",
      recommendationCode: "HASBLED_ELEVATED_REVIEW",
      evidenceGrade: "B",
      annualRiskPercent,
    };
  }

  return {
    tier: "high",
    recommendation:
      "High bleeding risk — closer follow-up required; reassess reversible factors.",
    recommendationCode: "HASBLED_HIGH_CLOSE_FOLLOWUP",
    evidenceGrade: "A",
    annualRiskPercent,
  };
}

export const calculator: CalcDefinition<typeof HasBledInputs> = {
  id: "hasbled",
  inputs: HasBledInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 9 },
  specialty: "cardiology",
  i18nKey: "hasbled",
  references: [
    {
      pmid: "21111555",
      citation:
        "Pisters R, Lane DA, Nieuwlaat R, de Vos CB, Crijns HJGM, Lip GYH. A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation: the Euro Heart Survey. Chest. 2010;138(5):1093-1100.",
    },
    {
      pmid: "39210723",
      citation:
        "Van Gelder IC, Rienstra M, Bunting KV, et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024;45(36):3314-3414.",
    },
  ],
};
