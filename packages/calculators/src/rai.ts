import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Rai staging for chronic lymphocytic leukaemia (Rai KR et al., 1975,
// PMID 1139039). Every stage presupposes blood and marrow lymphocytosis; the
// stage is the highest finding present. Tiers follow the modified three-risk
// grouping: 0 low, I-II intermediate, III-IV high (iwCLL 2018, PMID 29540348).

export const RaiInputs = z.object({
  lymphadenopathy: z.boolean(),
  organomegaly: z.boolean(),
  anaemia: z.boolean(),
  thrombocytopenia: z.boolean(),
});

export type RaiInput = z.infer<typeof RaiInputs>;

export function formula(inputs: RaiInput): number {
  if (inputs.thrombocytopenia) return 4;
  if (inputs.anaemia) return 3;
  if (inputs.organomegaly) return 2;
  if (inputs.lymphadenopathy) return 1;
  return 0;
}

export function interpret(score: number): InterpretResult {
  if (score >= 4) {
    return {
      tier: "high",
      recommendation:
        "Rai stage IV (high risk): lymphocytosis with thrombocytopenia (platelets < 100 ×10⁹/L). Treatment is generally indicated once a marrow-related cause is confirmed.",
      recommendationCode: "RAI_IV",
      evidenceGrade: "A",
    };
  }
  if (score === 3) {
    return {
      tier: "high",
      recommendation:
        "Rai stage III (high risk): lymphocytosis with anaemia (Hb < 11 g/dL). Treatment is generally indicated once a marrow-related cause is confirmed.",
      recommendationCode: "RAI_III",
      evidenceGrade: "A",
    };
  }
  if (score === 2) {
    return {
      tier: "moderate",
      recommendation:
        "Rai stage II (intermediate risk): lymphocytosis with splenomegaly and/or hepatomegaly. Treat only if iwCLL active-disease criteria are met.",
      recommendationCode: "RAI_II",
      evidenceGrade: "A",
    };
  }
  if (score === 1) {
    return {
      tier: "moderate",
      recommendation:
        "Rai stage I (intermediate risk): lymphocytosis with enlarged lymph nodes. Treat only if iwCLL active-disease criteria are met.",
      recommendationCode: "RAI_I",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Rai stage 0 (low risk): blood and marrow lymphocytosis only. Watch and wait is standard.",
    recommendationCode: "RAI_0",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof RaiInputs> = {
  id: "rai",
  inputs: RaiInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 4 },
  specialty: "hematology",
  i18nKey: "rai",
  fieldsMetadata: {
    lymphadenopathy: { widget: "boolean", defaultValue: false },
    organomegaly: { widget: "boolean", defaultValue: false },
    anaemia: { widget: "boolean", defaultValue: false },
    thrombocytopenia: { widget: "boolean", defaultValue: false },
  },
  references: [
    {
      pmid: "1139039",
      citation:
        "Rai KR, Sawitsky A, Cronkite EP, Chanana AD, Levy RN, Pasternack BS. Clinical staging of chronic lymphocytic leukemia. Blood. 1975;46(2):219-234.",
    },
    {
      pmid: "29540348",
      citation:
        "Hallek M, Cheson BD, Catovsky D, et al. iwCLL guidelines for diagnosis, indications for treatment, response assessment, and supportive management of CLL. Blood. 2018;131(25):2745-2760.",
    },
  ],
};
