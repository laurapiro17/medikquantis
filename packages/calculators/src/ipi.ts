import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// International Prognostic Index for aggressive non-Hodgkin lymphoma
// (International Non-Hodgkin's Lymphoma Prognostic Factors Project, 1993,
// PMID 8141877). One point per adverse factor, assessed before treatment.
// Survival figures are from the pre-rituximab derivation cohort.

export const IpiInputs = z.object({
  ageOver60: z.boolean(),
  ldhHigh: z.boolean(),
  ecog2OrMore: z.boolean(),
  advancedStage: z.boolean(),
  extranodalOver1: z.boolean(),
});

export type IpiInput = z.infer<typeof IpiInputs>;

export function formula(inputs: IpiInput): number {
  return Object.values(inputs).filter(Boolean).length;
}

export function interpret(score: number): InterpretResult {
  if (score >= 4) {
    return {
      tier: "high",
      recommendation:
        "High risk (IPI 4-5). Five-year overall survival was 26% in the original pre-rituximab cohort.",
      recommendationCode: "IPI_HIGH",
      evidenceGrade: "A",
    };
  }
  if (score === 3) {
    return {
      tier: "moderate",
      recommendation:
        "High-intermediate risk (IPI 3). Five-year overall survival was 43% in the original pre-rituximab cohort.",
      recommendationCode: "IPI_HIGH_INTERMEDIATE",
      evidenceGrade: "A",
    };
  }
  if (score === 2) {
    return {
      tier: "moderate",
      recommendation:
        "Low-intermediate risk (IPI 2). Five-year overall survival was 51% in the original pre-rituximab cohort.",
      recommendationCode: "IPI_LOW_INTERMEDIATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Low risk (IPI 0-1). Five-year overall survival was 73% in the original pre-rituximab cohort.",
    recommendationCode: "IPI_LOW",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof IpiInputs> = {
  id: "ipi",
  inputs: IpiInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 5 },
  specialty: "hematology",
  i18nKey: "ipi",
  fieldsMetadata: {
    ageOver60: { widget: "boolean", defaultValue: false },
    ldhHigh: { widget: "boolean", defaultValue: false },
    ecog2OrMore: { widget: "boolean", defaultValue: false },
    advancedStage: { widget: "boolean", defaultValue: false },
    extranodalOver1: { widget: "boolean", defaultValue: false },
  },
  references: [
    {
      pmid: "8141877",
      citation:
        "International Non-Hodgkin's Lymphoma Prognostic Factors Project. A predictive model for aggressive non-Hodgkin's lymphoma. N Engl J Med. 1993;329(14):987-994.",
    },
  ],
};
