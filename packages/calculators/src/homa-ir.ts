import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

export const HomaIrInputs = z.object({
  fastingGlucoseMgDl: z.number().min(30).max(500),
  fastingInsulinuIUml: z.number().min(0.5).max(300),
});

export type HomaIrInput = z.infer<typeof HomaIrInputs>;

export function formula(inputs: HomaIrInput): number {
  const homa = (inputs.fastingGlucoseMgDl * inputs.fastingInsulinuIUml) / 405;
  return Math.round(homa * 100) / 100;
}

export function interpret(score: number): InterpretResult {
  if (score < 1.0) {
    return {
      tier: "low",
      recommendation:
        "Optimal insulin sensitivity (HOMA-IR < 1.0). Low risk of insulin resistance.",
      recommendationCode: "HOMA_OPTIMAL",
      evidenceGrade: "A",
    };
  }

  if (score < 2.0) {
    return {
      tier: "moderate",
      recommendation:
        "Early or mild insulin resistance (HOMA-IR 1.0–1.9). Recommend physical activity, dietary counseling, and periodic metabolic monitoring.",
      recommendationCode: "HOMA_MILD",
      evidenceGrade: "A",
    };
  }

  return {
    tier: "high",
    recommendation:
      "Significant insulin resistance (HOMA-IR ≥ 2.0). Elevated risk for metabolic syndrome, type 2 diabetes mellitus, and cardiovascular disease.",
    recommendationCode: "HOMA_ELEVATED",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof HomaIrInputs> = {
  id: "homa-ir",
  inputs: HomaIrInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0.1, max: 50 },
  specialty: "endocrinology",
  i18nKey: "homaIr",
  fieldsMetadata: {
    fastingGlucoseMgDl: { widget: "number", min: 30, max: 500, defaultValue: 95 },
    fastingInsulinuIUml: { widget: "number", min: 0.5, max: 300, defaultValue: 5 },
  },
  references: [
    {
      pmid: "3899825",
      citation:
        "Matthews DR, Hosker JP, Rudenski AS, Naylor BA, Treacher DF, Turner RC. Homeostasis model assessment: insulin resistance and beta-cell function from fasting plasma glucose and insulin concentrations in man. Diabetologia. 1985;28(7):412-419.",
    },
  ],
};
