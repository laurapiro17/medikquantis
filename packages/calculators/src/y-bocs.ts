import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Scoring from clinician-rated subtotals; the licensed interview is not reproduced.
export const YbocsInputs = z.object({
  obsessions: z.number().int().min(0).max(20),
  compulsions: z.number().int().min(0).max(20),
});

export type YbocsInput = z.infer<typeof YbocsInputs>;

export function formula(inputs: YbocsInput): number {
  const { obsessions, compulsions } = YbocsInputs.parse(inputs);
  return obsessions + compulsions;
}

export function interpret(score: number): InterpretResult {
  // Conventional severity bands for the original adult scale: https://ocdscales.com/
  if (score >= 32) {
    return {
      tier: "high",
      recommendation: "Extreme obsessive-compulsive symptom severity (32-40). Interpret within a full clinical assessment.",
      recommendationCode: "YBOCS_EXTREME",
      evidenceGrade: "B",
    };
  }
  if (score >= 24) {
    return {
      tier: "high",
      recommendation: "Severe obsessive-compulsive symptom severity (24-31). Interpret within a full clinical assessment.",
      recommendationCode: "YBOCS_SEVERE",
      evidenceGrade: "B",
    };
  }
  if (score >= 16) {
    return {
      tier: "moderate",
      recommendation: "Moderate obsessive-compulsive symptom severity (16-23). Interpret within a full clinical assessment.",
      recommendationCode: "YBOCS_MODERATE",
      evidenceGrade: "B",
    };
  }
  if (score >= 8) {
    return {
      tier: "low",
      recommendation: "Mild obsessive-compulsive symptom severity (8-15). Interpret within a full clinical assessment.",
      recommendationCode: "YBOCS_MILD",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "low",
    recommendation: "Subclinical obsessive-compulsive symptom severity (0-7). This score alone does not exclude OCD.",
    recommendationCode: "YBOCS_SUBCLINICAL",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof YbocsInputs> = {
  id: "y-bocs",
  inputs: YbocsInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 40 },
  specialty: "psychiatry",
  i18nKey: "ybocs",
  fieldsMetadata: {
    obsessions: { widget: "number", min: 0, max: 20, step: 1 },
    compulsions: { widget: "number", min: 0, max: 20, step: 1 },
  },
  references: [
    {
      pmid: "2684084",
      citation: "Goodman WK, Price LH, Rasmussen SA, et al. The Yale-Brown Obsessive Compulsive Scale. I. Development, use, and reliability. Arch Gen Psychiatry. 1989;46(11):1006-1011.",
    },
  ],
};
