import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Revised Cardiac Risk Index (Lee TH et al. 1999, PMID 10477528).
// Predicts major cardiac complications (MI, pulmonary oedema, VF / cardiac
// arrest, complete heart block) after non-cardiac surgery. Six binary
// criteria, each 1 point.

export const RcriInputs = z.object({
  highRiskSurgery: z.boolean(),
  ischemicHeartDisease: z.boolean(),
  congestiveHeartFailure: z.boolean(),
  cerebrovascularDisease: z.boolean(),
  preoperativeInsulin: z.boolean(),
  creatinineOver2: z.boolean(),
});

export type RcriInput = z.infer<typeof RcriInputs>;

export function formula(inputs: RcriInput): number {
  let score = 0;
  if (inputs.highRiskSurgery) score += 1;
  if (inputs.ischemicHeartDisease) score += 1;
  if (inputs.congestiveHeartFailure) score += 1;
  if (inputs.cerebrovascularDisease) score += 1;
  if (inputs.preoperativeInsulin) score += 1;
  if (inputs.creatinineOver2) score += 1;
  return score;
}

// Major cardiac event rates per Lee 1999 derivation cohort
// (n=4315 patients undergoing major elective non-cardiac surgery).
const eventRateByScore: Record<number, number> = {
  0: 0.4,
  1: 0.9,
  2: 6.6,
  3: 11.0,
  4: 11.0,
  5: 11.0,
  6: 11.0,
};

export function interpret(score: number): InterpretResult {
  const eventRate = eventRateByScore[Math.min(score, 6)] ?? 11;
  if (score === 0) {
    return {
      tier: "low",
      recommendation:
        "Very low cardiac risk (~0.4%); no further cardiac testing usually needed before surgery.",
      recommendationCode: "RCRI_VERY_LOW",
      evidenceGrade: "A",
      annualRiskPercent: eventRate,
    };
  }
  if (score === 1) {
    return {
      tier: "low",
      recommendation:
        "Low cardiac risk (~0.9%); further testing rarely changes management.",
      recommendationCode: "RCRI_LOW",
      evidenceGrade: "A",
      annualRiskPercent: eventRate,
    };
  }
  if (score === 2) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate cardiac risk (~6.6%); consider functional capacity assessment and selective non-invasive testing if it will change management.",
      recommendationCode: "RCRI_INTERMEDIATE",
      evidenceGrade: "A",
      annualRiskPercent: eventRate,
    };
  }
  return {
    tier: "high",
    recommendation:
      "High cardiac risk (≥11%); structured perioperative optimisation, cardiology input and balanced anaesthesia plan indicated.",
    recommendationCode: "RCRI_HIGH",
    evidenceGrade: "A",
    annualRiskPercent: eventRate,
  };
}

export const calculator: CalcDefinition<typeof RcriInputs> = {
  id: "rcri",
  inputs: RcriInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 6 },
  specialty: "surgery",
  i18nKey: "rcri",
  references: [
    {
      pmid: "10477528",
      citation:
        "Lee TH, Marcantonio ER, Mangione CM, et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation. 1999;100(10):1043-1049.",
    },
  ],
};
