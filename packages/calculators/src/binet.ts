import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Binet staging for chronic lymphocytic leukaemia (Binet JL et al., 1981,
// PMID 7237385). The five lymphoid areas are cervical, axillary and inguinal
// nodes (each counted once whether unilateral or bilateral), spleen and liver.

export const BinetInputs = z.object({
  stage: z.enum(["A", "B", "C"]),
});

export type BinetInput = z.infer<typeof BinetInputs>;

const STAGE_SCORE: Record<BinetInput["stage"], number> = { A: 0, B: 1, C: 2 };

export function formula(inputs: BinetInput): number {
  return STAGE_SCORE[inputs.stage];
}

export function interpret(score: number): InterpretResult {
  if (score >= 2) {
    return {
      tier: "high",
      recommendation:
        "Binet stage C: anaemia (Hb < 10 g/dL) and/or thrombocytopenia (platelets < 100 ×10⁹/L). Treatment is generally indicated.",
      recommendationCode: "BINET_C",
      evidenceGrade: "A",
    };
  }
  if (score === 1) {
    return {
      tier: "moderate",
      recommendation:
        "Binet stage B: three or more involved lymphoid areas without anaemia or thrombocytopenia. Treat if there are active-disease criteria.",
      recommendationCode: "BINET_B",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "low",
    recommendation:
      "Binet stage A: fewer than three involved lymphoid areas, no anaemia or thrombocytopenia. Watch and wait is standard.",
    recommendationCode: "BINET_A",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof BinetInputs> = {
  id: "binet",
  inputs: BinetInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 2 },
  specialty: "hematology",
  i18nKey: "binet",
  fieldsMetadata: {
    stage: {
      widget: "radio",
      layout: "cards",
      defaultValue: "A",
      options: [{ value: "A" }, { value: "B" }, { value: "C" }],
    },
  },
  references: [
    {
      pmid: "7237385",
      citation:
        "Binet JL, Auquier A, Dighiero G, et al. A new prognostic classification of chronic lymphocytic leukemia derived from a multivariate survival analysis. Cancer. 1981;48(1):198-206.",
    },
  ],
};
