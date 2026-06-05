import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

export const OrbitInputs = z.object({
  age: z.number().int().min(18).max(120),
  reducedHemoglobinOrHematocrit: z.boolean(),
  bleedingHistory: z.boolean(),
  reducedRenalFunction: z.boolean(),
  antiplateletTreatment: z.boolean(),
});

export type OrbitInput = z.infer<typeof OrbitInputs>;

export function formula(inputs: OrbitInput): number {
  let score = 0;
  if (inputs.age >= 75) score += 1;
  if (inputs.reducedHemoglobinOrHematocrit) score += 2;
  if (inputs.bleedingHistory) score += 2;
  if (inputs.reducedRenalFunction) score += 1;
  if (inputs.antiplateletTreatment) score += 1;
  return score;
}

// Bleeding events per 100 patient-years per O'Brien et al. 2015
// (ROCKET-AF cohort, PMID 26321676). Used as the canonical reference.
const annualRiskByScore: Record<number, number> = {
  0: 2.4,
  1: 2.4,
  2: 2.4,
  3: 4.7,
  4: 8.1,
  5: 8.1,
  6: 8.1,
  7: 8.1,
};

export function interpret(score: number): InterpretResult {
  const annualRiskPercent = annualRiskByScore[score];

  if (score <= 2) {
    return {
      tier: "low",
      recommendation: "Low bleeding risk; anticoagulation is not precluded.",
      evidenceGrade: "B",
      annualRiskPercent,
    };
  }

  if (score === 3) {
    return {
      tier: "moderate",
      recommendation:
        "Medium bleeding risk — review reversible factors and follow up closely.",
      evidenceGrade: "B",
      annualRiskPercent,
    };
  }

  return {
    tier: "high",
    recommendation:
      "High bleeding risk — close follow-up required; address modifiable factors.",
    evidenceGrade: "B",
    annualRiskPercent,
  };
}

export const calculator: CalcDefinition<typeof OrbitInputs> = {
  id: "orbit",
  inputs: OrbitInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 7 },
  specialty: "cardiology",
  i18nKey: "orbit",
  references: [
    {
      pmid: "26321676",
      citation:
        "O'Brien EC, Simon DN, Thomas LE, et al. The ORBIT bleeding score: a simple bedside score to assess bleeding risk in atrial fibrillation. Eur Heart J. 2015;36(46):3258-3264.",
    },
    {
      pmid: "39210723",
      citation:
        "Van Gelder IC, Rienstra M, Bunting KV, et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024;45(36):3314-3414.",
    },
  ],
};
