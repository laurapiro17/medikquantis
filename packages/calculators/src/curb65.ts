import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// CURB-65 community-acquired pneumonia severity score (Lim WS et al. 2003,
// BTS pneumonia guidelines, PMID 12728155). Five binary criteria summed
// 0..5. ESC/BTS site-of-care recommendation: 0-1 outpatient, 2 ward,
// 3-5 ICU consideration.

export const Curb65Inputs = z.object({
  confusion: z.boolean(),
  ureaOver7: z.boolean(),
  respiratoryRateAtLeast30: z.boolean(),
  lowBloodPressure: z.boolean(),
  ageAtLeast65: z.boolean(),
});

export type Curb65Input = z.infer<typeof Curb65Inputs>;

export function formula(inputs: Curb65Input): number {
  let score = 0;
  if (inputs.confusion) score += 1;
  if (inputs.ureaOver7) score += 1;
  if (inputs.respiratoryRateAtLeast30) score += 1;
  if (inputs.lowBloodPressure) score += 1;
  if (inputs.ageAtLeast65) score += 1;
  return score;
}

// 30-day mortality per Lim 2003 derivation cohort (n=1,068, multinational).
const mortalityByScore: Record<number, number> = {
  0: 0.7,
  1: 3.2,
  2: 13.0,
  3: 17.0,
  4: 41.5,
  5: 57.0,
};

export function interpret(score: number): InterpretResult {
  const annualRiskPercent = mortalityByScore[score];

  if (score <= 1) {
    return {
      tier: "low",
      recommendation:
        "Low 30-day mortality; outpatient treatment is usually appropriate.",
      recommendationCode: "CURB65_LOW_OUTPATIENT",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }
  if (score === 2) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate risk; consider hospital admission for short observation.",
      recommendationCode: "CURB65_INTERMEDIATE_WARD",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }
  return {
    tier: "high",
    recommendation:
      "Severe pneumonia; admit and consider intensive care evaluation.",
    recommendationCode: "CURB65_SEVERE_ICU",
    evidenceGrade: "A",
    annualRiskPercent,
  };
}

export const calculator: CalcDefinition<typeof Curb65Inputs> = {
  id: "curb-65",
  inputs: Curb65Inputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 5 },
  specialty: "pulmonology",
  i18nKey: "curb65",
  references: [
    {
      pmid: "12728155",
      citation:
        "Lim WS, van der Eerden MM, Laing R, et al. Defining community acquired pneumonia severity on presentation to hospital: an international derivation and validation study. Thorax. 2003;58(5):377-382.",
    },
  ],
};
