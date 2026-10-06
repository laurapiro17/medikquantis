import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// International Staging System for multiple myeloma (Greipp PR et al., 2005,
// PMID 15809451). Serum β2-microglobulin in mg/L and albumin in g/dL, as in
// the original paper. Survival figures are from that 2005 cohort.

export const IssInputs = z.object({
  beta2Microglobulin: z.number().positive().max(100),
  albumin: z.number().positive().max(7),
});

export type IssInput = z.infer<typeof IssInputs>;

export function formula(inputs: IssInput): number {
  if (inputs.beta2Microglobulin >= 5.5) return 3;
  if (inputs.beta2Microglobulin < 3.5 && inputs.albumin >= 3.5) return 1;
  return 2;
}

export function interpret(score: number): InterpretResult {
  if (score >= 3) {
    return {
      tier: "high",
      recommendation:
        "ISS stage III: β2-microglobulin ≥ 5.5 mg/L. Median survival was 29 months in the original cohort; renal impairment also raises β2-microglobulin.",
      recommendationCode: "ISS_III",
      evidenceGrade: "A",
    };
  }
  if (score === 2) {
    return {
      tier: "moderate",
      recommendation:
        "ISS stage II: neither stage I nor stage III. Median survival was 44 months in the original cohort.",
      recommendationCode: "ISS_II",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "ISS stage I: β2-microglobulin < 3.5 mg/L and albumin ≥ 3.5 g/dL. Median survival was 62 months in the original cohort.",
    recommendationCode: "ISS_I",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof IssInputs> = {
  id: "iss",
  inputs: IssInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 1, max: 3 },
  specialty: "hematology",
  i18nKey: "iss",
  fieldsMetadata: {
    beta2Microglobulin: { widget: "number", min: 0.1, max: 100, step: 0.1, unit: "mg/L", defaultValue: 2.5 },
    albumin: { widget: "number", min: 0.1, max: 7, step: 0.1, unit: "g/dL", defaultValue: 4 },
  },
  references: [
    {
      pmid: "15809451",
      citation:
        "Greipp PR, San Miguel J, Durie BGM, et al. International staging system for multiple myeloma. J Clin Oncol. 2005;23(15):3412-3420.",
    },
  ],
};
