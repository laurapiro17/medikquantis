import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Body Surface Area (BSA) - Mosteller Formula
// (Mosteller RD. N Engl J Med 1987;317:1098, PMID 3657889).
// BSA (m²) = sqrt([Height (cm) x Weight (kg)] / 3600)

export const BsaMostellerInputs = z.object({
  height: z.number().min(10).max(250),
  weight: z.number().min(0.5).max(300),
});

export type BsaMostellerInput = z.infer<typeof BsaMostellerInputs>;

export function formula(inputs: BsaMostellerInput): number {
  const bsa = Math.sqrt((inputs.height * inputs.weight) / 3600);
  return Math.round(bsa * 100) / 100;
}

export function interpret(score: number): InterpretResult {
  // Average adult BSA is ~1.7 - 1.9 m²
  if (score < 1.4) {
    return {
      tier: "low",
      recommendation:
        "BSA is below average adult range (< 1.4 m²). Common in pediatric patients or small adults; adjust chemotherapy and fluid dosing accordingly.",
      recommendationCode: "BSA_LOW",
      evidenceGrade: "A",
    };
  }
  if (score <= 2.2) {
    return {
      tier: "low",
      recommendation:
        "BSA is within standard adult range (1.4–2.2 m²). Use for indexing GFR, cardiac output, and drug dosing.",
      recommendationCode: "BSA_NORMAL",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "moderate",
    recommendation:
      "BSA is above average adult range (> 2.2 m²). Consider ideal body weight capping if recommended for chemotherapy dosing.",
    recommendationCode: "BSA_HIGH",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof BsaMostellerInputs> = {
  id: "bsa-mosteller",
  inputs: BsaMostellerInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0.1, max: 3.5 },
  specialty: "internal_medicine",
  i18nKey: "bsaMosteller",
  references: [
    {
      pmid: "3657876",
      citation:
        "Mosteller RD. Simplified calculation of body-surface area. N Engl J Med. 1987;317(17):1098.",
    },
  ],
};
