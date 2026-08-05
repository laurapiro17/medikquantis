import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Khorana score for chemotherapy-associated venous thromboembolism
// (Khorana AA et al., 2008, PMID 18216292). Assessed before starting a new
// systemic chemotherapy regimen in an ambulatory patient.

export const KhoranaInputs = z.object({
  tumourSite: z.enum(["0", "1", "2"]),
  plateletsHigh: z.boolean(),
  anaemiaOrEsa: z.boolean(),
  leukocytesHigh: z.boolean(),
  bmiHigh: z.boolean(),
});

export type KhoranaInput = z.infer<typeof KhoranaInputs>;

export function formula(inputs: KhoranaInput): number {
  return (
    parseInt(inputs.tumourSite, 10) +
    (inputs.plateletsHigh ? 1 : 0) +
    (inputs.anaemiaOrEsa ? 1 : 0) +
    (inputs.leukocytesHigh ? 1 : 0) +
    (inputs.bmiHigh ? 1 : 0)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 3) {
    return {
      tier: "high",
      recommendation:
        "High risk of chemotherapy-associated VTE (score >= 3). Thromboprophylaxis is recommended by guideline in the absence of bleeding risk.",
      recommendationCode: "KHORANA_HIGH",
      evidenceGrade: "A",
    };
  }
  if (score >= 1) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate risk (score 1-2). Routine thromboprophylaxis is not recommended; reassess if the clinical situation changes.",
      recommendationCode: "KHORANA_INTERMEDIATE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Low risk (score 0). Thromboprophylaxis is not indicated; educate on the symptoms of thrombosis.",
    recommendationCode: "KHORANA_LOW",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof KhoranaInputs> = {
  id: "khorana",
  inputs: KhoranaInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 6 },
  specialty: "hematology",
  i18nKey: "khorana",
  fieldsMetadata: {
    tumourSite: {
      widget: "radio",
      layout: "cards",
      defaultValue: "0",
      options: [{ value: "0" }, { value: "1" }, { value: "2" }],
    },
    plateletsHigh: { widget: "boolean", defaultValue: false },
    anaemiaOrEsa: { widget: "boolean", defaultValue: false },
    leukocytesHigh: { widget: "boolean", defaultValue: false },
    bmiHigh: { widget: "boolean", defaultValue: false },
  },
  references: [
    {
      pmid: "18216292",
      citation:
        "Khorana AA, Kuderer NM, Culakova E, Lyman GH, Francis CW. Development and validation of a predictive model for chemotherapy-associated thrombosis. Blood. 2008;111(10):4902-4907.",
    },
  ],
};
