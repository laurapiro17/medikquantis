import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// SAD PERSONS Scale for Suicide Risk (Patterson WM et al., 1983, PMID 6833878).
// Evaluates 10 clinical risk factors (0-1 points each, max 10).

export const SadPersonsInputs = z.object({
  sex: z.enum(["0", "1"]), // Male sex (+1)
  age: z.enum(["0", "1"]), // Age <19 or >45 (+1)
  depression: z.enum(["0", "1"]), // Depression (+1)
  previousAttempt: z.enum(["0", "1"]), // Previous suicide attempt (+1)
  ethanolUse: z.enum(["0", "1"]), // Ethanol / substance abuse (+1)
  rationalThinkingLoss: z.enum(["0", "1"]), // Rational thinking loss (+1)
  socialSupportsLacking: z.enum(["0", "1"]), // Social supports lacking (+1)
  organizedPlan: z.enum(["0", "1"]), // Organized plan or lethal intent (+1)
  noSpouse: z.enum(["0", "1"]), // No spouse / single / divorced / widowed (+1)
  sickness: z.enum(["0", "1"]), // Chronic physical sickness (+1)
});

export type SadPersonsInput = z.infer<typeof SadPersonsInputs>;

export function formula(inputs: SadPersonsInput): number {
  return (
    parseInt(inputs.sex, 10) +
    parseInt(inputs.age, 10) +
    parseInt(inputs.depression, 10) +
    parseInt(inputs.previousAttempt, 10) +
    parseInt(inputs.ethanolUse, 10) +
    parseInt(inputs.rationalThinkingLoss, 10) +
    parseInt(inputs.socialSupportsLacking, 10) +
    parseInt(inputs.organizedPlan, 10) +
    parseInt(inputs.noSpouse, 10) +
    parseInt(inputs.sickness, 10)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 7) {
    return {
      tier: "high",
      recommendation:
        "Very high suicide risk (7–10). Immediate psychiatric hospitalization and 1:1 safety precautions mandatory.",
      recommendationCode: "SAD_PERSONS_VERY_HIGH",
      evidenceGrade: "B",
    };
  }
  if (score >= 5) {
    return {
      tier: "high",
      recommendation:
        "High suicide risk (5–6). Strongly recommend psychiatric hospitalization or emergency psychiatric evaluation.",
      recommendationCode: "SAD_PERSONS_HIGH",
      evidenceGrade: "B",
    };
  }
  if (score >= 3) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate suicide risk (3–4). Close outpatient psychiatric follow-up required; consider hospitalization if support system is lacking.",
      recommendationCode: "SAD_PERSONS_MODERATE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Low suicide risk (0–2). Discharge with outpatient psychiatric evaluation and crisis hotline safety planning.",
    recommendationCode: "SAD_PERSONS_LOW",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof SadPersonsInputs> = {
  id: "sad-persons",
  inputs: SadPersonsInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 10 },
  specialty: "psychiatry",
  i18nKey: "sadPersons",
  references: [
    {
      pmid: "6867245",
      citation:
        "Patterson WM, Dohn HH, Bird J, Patterson GA. Evaluation of suicidal patients: the SAD PERSONS scale. Psychosomatics. 1983;24(4):343-349.",
    },
  ],
};
