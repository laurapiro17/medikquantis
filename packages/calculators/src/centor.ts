import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Centor score for group A strep pharyngitis (Centor RM et al. 1981,
// PMID 6452404). McIsaac modification (1998, PMID 9457881) added age
// adjustment for paediatric and elderly populations. Score range -1..5
// after McIsaac age points.

export const CentorInputs = z.object({
  tonsillarExudate: z.boolean(),
  tenderAnteriorCervicalNodes: z.boolean(),
  feverHistory: z.boolean(),
  absenceOfCough: z.boolean(),
  ageBand: z.enum(["lt_15", "15_to_44", "gte_45"]),
});

export type CentorInput = z.infer<typeof CentorInputs>;

const ageModifier = {
  lt_15: 1,
  "15_to_44": 0,
  gte_45: -1,
} as const satisfies Record<CentorInput["ageBand"], number>;

export function formula(inputs: CentorInput): number {
  let score = 0;
  if (inputs.tonsillarExudate) score += 1;
  if (inputs.tenderAnteriorCervicalNodes) score += 1;
  if (inputs.feverHistory) score += 1;
  if (inputs.absenceOfCough) score += 1;
  score += ageModifier[inputs.ageBand];
  return score;
}

// Approximate group-A-strep probability per McIsaac 1998 validation cohort.
const strepProbByScore: Record<number, number> = {
  [-1]: 1,
  0: 2.5,
  1: 6.5,
  2: 15.0,
  3: 32.0,
  4: 56.0,
  5: 56.0,
};

export function interpret(score: number): InterpretResult {
  const annualRiskPercent = strepProbByScore[score];

  if (score <= 1) {
    return {
      tier: "low",
      recommendation:
        "Low probability of strep; neither testing nor empirical antibiotics are needed.",
      recommendationCode: "CENTOR_LOW_NO_TEST",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }
  if (score <= 3) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate probability; perform a rapid antigen detection test and treat only if positive.",
      recommendationCode: "CENTOR_MODERATE_RADT",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }
  return {
    tier: "high",
    recommendation:
      "High probability; consider empirical antibiotics or confirm with a rapid antigen test before treating.",
    recommendationCode: "CENTOR_HIGH_TREAT",
    evidenceGrade: "B",
    annualRiskPercent,
  };
}

export const calculator: CalcDefinition<typeof CentorInputs> = {
  id: "centor",
  inputs: CentorInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: -1, max: 5 },
  specialty: "emergency",
  i18nKey: "centor",
  references: [
    {
      pmid: "6763125",
      citation:
        "Centor RM, Witherspoon JM, Dalton HP, Brody CE, Link K. The diagnosis of strep throat in adults in the emergency room. Med Decis Making. 1981;1(3):239-246.",
    },
    {
      pmid: "9475915",
      citation:
        "McIsaac WJ, White D, Tannenbaum D, Low DE. A clinical score to reduce unnecessary antibiotic use in patients with sore throat. CMAJ. 1998;158(1):75-83.",
    },
  ],
};
