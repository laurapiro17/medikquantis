import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";
import { formula as issStage, IssInputs } from "./iss";

// Revised International Staging System for multiple myeloma (Palumbo A et al.,
// 2015, PMID 26240224), for newly diagnosed disease. High-risk cytogenetics
// means del(17p), t(4;14) or t(14;16) by iFISH; LDH is high above the upper
// limit of normal. The ISS stage underneath uses the original ISS cut-offs.

export const RIssInputs = IssInputs.extend({
  highRiskCytogenetics: z.boolean(),
  ldhHigh: z.boolean(),
});

export type RIssInput = z.infer<typeof RIssInputs>;

export function formula(inputs: RIssInput): number {
  const iss = issStage(inputs);
  const adverse = inputs.highRiskCytogenetics || inputs.ldhHigh;
  if (iss === 3 && adverse) return 3;
  if (iss === 1 && !adverse) return 1;
  return 2;
}

export function interpret(score: number): InterpretResult {
  if (score >= 3) {
    return {
      tier: "high",
      recommendation:
        "R-ISS stage III: ISS III with high-risk cytogenetics or high LDH. Five-year overall survival was 40% in the IMWG cohort.",
      recommendationCode: "RISS_III",
      evidenceGrade: "A",
    };
  }
  if (score === 2) {
    return {
      tier: "moderate",
      recommendation:
        "R-ISS stage II: neither stage I nor stage III. Five-year overall survival was 62% in the IMWG cohort.",
      recommendationCode: "RISS_II",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "R-ISS stage I: ISS I with standard-risk cytogenetics and normal LDH. Five-year overall survival was 82% in the IMWG cohort.",
    recommendationCode: "RISS_I",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof RIssInputs> = {
  id: "r-iss",
  inputs: RIssInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 1, max: 3 },
  specialty: "hematology",
  i18nKey: "rIss",
  fieldsMetadata: {
    beta2Microglobulin: { widget: "number", min: 0.1, max: 100, step: 0.1, unit: "mg/L", defaultValue: 2.5 },
    albumin: { widget: "number", min: 0.1, max: 7, step: 0.1, unit: "g/dL", defaultValue: 4 },
    highRiskCytogenetics: { widget: "boolean", defaultValue: false },
    ldhHigh: { widget: "boolean", defaultValue: false },
  },
  references: [
    {
      pmid: "26240224",
      citation:
        "Palumbo A, Avet-Loiseau H, Oliva S, et al. Revised International Staging System for Multiple Myeloma: a report from International Myeloma Working Group. J Clin Oncol. 2015;33(26):2863-2869.",
    },
    {
      pmid: "15809451",
      citation:
        "Greipp PR, San Miguel J, Durie BGM, et al. International staging system for multiple myeloma. J Clin Oncol. 2005;23(15):3412-3420.",
    },
  ],
};
