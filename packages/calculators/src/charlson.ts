import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Age-adjusted Charlson Comorbidity Index (Charlson ME et al. 1987,
// PMID 3558716). 17 comorbidities with weights 1/2/3/6 + an age bonus
// of 1 point per decade from 50 onwards. Predicts 10-year mortality and
// is the universally cited comorbidity adjustment in observational
// research.

export const CharlsonInputs = z.object({
  ageYears: z.number().int().min(0).max(120),
  // 1-point comorbidities
  myocardialInfarction: z.boolean(),
  congestiveHeartFailure: z.boolean(),
  peripheralVascularDisease: z.boolean(),
  cerebrovascularDisease: z.boolean(),
  dementia: z.boolean(),
  chronicPulmonaryDisease: z.boolean(),
  connectiveTissueDisease: z.boolean(),
  pepticUlcerDisease: z.boolean(),
  mildLiverDisease: z.boolean(),
  diabetesUncomplicated: z.boolean(),
  // 2-point comorbidities
  hemiplegia: z.boolean(),
  moderateSevereRenalDisease: z.boolean(),
  diabetesWithEndOrganDamage: z.boolean(),
  anyTumorPast5Years: z.boolean(),
  leukemia: z.boolean(),
  lymphoma: z.boolean(),
  // 3-point comorbidities
  moderateSevereLiverDisease: z.boolean(),
  // 6-point comorbidities
  metastaticSolidTumor: z.boolean(),
  aids: z.boolean(),
});

export type CharlsonInput = z.infer<typeof CharlsonInputs>;

const oneWeight: ReadonlyArray<keyof CharlsonInput> = [
  "myocardialInfarction",
  "congestiveHeartFailure",
  "peripheralVascularDisease",
  "cerebrovascularDisease",
  "dementia",
  "chronicPulmonaryDisease",
  "connectiveTissueDisease",
  "pepticUlcerDisease",
  "mildLiverDisease",
  "diabetesUncomplicated",
];

const twoWeight: ReadonlyArray<keyof CharlsonInput> = [
  "hemiplegia",
  "moderateSevereRenalDisease",
  "diabetesWithEndOrganDamage",
  "anyTumorPast5Years",
  "leukemia",
  "lymphoma",
];

const threeWeight: ReadonlyArray<keyof CharlsonInput> = [
  "moderateSevereLiverDisease",
];

const sixWeight: ReadonlyArray<keyof CharlsonInput> = [
  "metastaticSolidTumor",
  "aids",
];

export function formula(inputs: CharlsonInput): number {
  let score = 0;
  for (const k of oneWeight) if (inputs[k]) score += 1;
  for (const k of twoWeight) if (inputs[k]) score += 2;
  for (const k of threeWeight) if (inputs[k]) score += 3;
  for (const k of sixWeight) if (inputs[k]) score += 6;
  // Age bonus: 1 point per decade ≥50
  if (inputs.ageYears >= 50) {
    score += Math.min(Math.floor((inputs.ageYears - 40) / 10), 4);
  }
  return score;
}

// 10-year survival per Charlson 1987 derivation cohort.
const tenYearSurvivalByScore: Record<number, number> = {
  0: 99,
  1: 96,
  2: 90,
  3: 77,
  4: 53,
  5: 21,
};

export function interpret(score: number): InterpretResult {
  const survival = tenYearSurvivalByScore[Math.min(score, 5)] ?? 21;
  const mortality = 100 - survival;

  if (score <= 2) {
    return {
      tier: "low",
      recommendation:
        "Low comorbidity burden; expected 10-year survival above 90%.",
      recommendationCode: "CHARLSON_LOW",
      evidenceGrade: "A",
      annualRiskPercent: mortality,
    };
  }
  if (score <= 4) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate comorbidity burden; meaningful impact on 10-year survival.",
      recommendationCode: "CHARLSON_MODERATE",
      evidenceGrade: "A",
      annualRiskPercent: mortality,
    };
  }
  return {
    tier: "high",
    recommendation:
      "High comorbidity burden; substantially reduced 10-year survival — weigh aggressive treatments against expected life years.",
    recommendationCode: "CHARLSON_HIGH",
    evidenceGrade: "A",
    annualRiskPercent: mortality,
  };
}

export const calculator: CalcDefinition<typeof CharlsonInputs> = {
  id: "charlson",
  inputs: CharlsonInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 37 },
  specialty: "internal_medicine",
  i18nKey: "charlson",
  references: [
    {
      pmid: "3558716",
      citation:
        "Charlson ME, Pompei P, Ales KL, MacKenzie CR. A new method of classifying prognostic comorbidity in longitudinal studies: development and validation. J Chronic Dis. 1987;40(5):373-383.",
    },
  ],
};
