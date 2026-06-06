import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Albumin-corrected calcium (Payne RB et al. 1973, BMJ 4:643, PMID 4758544).
// Corrects measured total calcium for the patient's albumin level, which
// determines how much calcium is protein-bound vs. ionised/free.
// Returns the corrected calcium in mg/dL.

export const CalciumCorrectedInputs = z.object({
  calciumMgDl: z.number().min(2).max(20),
  albuminGDl: z.number().min(0.5).max(8),
});

export type CalciumCorrectedInput = z.infer<typeof CalciumCorrectedInputs>;

// Payne 1973 formula:
//   corrected_Ca (mg/dL) = measured_Ca + 0.8 × (4 - albumin)
// Reference normal albumin = 4.0 g/dL.
export function formula(inputs: CalciumCorrectedInput): number {
  const corrected = inputs.calciumMgDl + 0.8 * (4 - inputs.albuminGDl);
  return Math.round(corrected * 100) / 100;
}

interface CalciumInterpretResult extends InterpretResult {
  category: "hypocalcaemia" | "normal" | "hypercalcaemia";
}

export function interpret(score: number): CalciumInterpretResult {
  // KDIGO / Endocrine Society reference range for total calcium:
  //   8.5 – 10.5 mg/dL (2.1 – 2.6 mmol/L)
  if (score < 8.5) {
    return {
      category: "hypocalcaemia",
      tier: "moderate",
      recommendation:
        "Corrected calcium below normal range; evaluate symptoms (Chvostek, Trousseau, tetany) and consider replacement.",
      recommendationCode: "CA_CORR_HYPO",
      evidenceGrade: "B",
    };
  }
  if (score > 10.5) {
    return {
      category: "hypercalcaemia",
      tier: "high",
      recommendation:
        "Corrected calcium above normal range; investigate causes (PTH, malignancy, vitamin D) and severity.",
      recommendationCode: "CA_CORR_HYPER",
      evidenceGrade: "B",
    };
  }
  return {
    category: "normal",
    tier: "low",
    recommendation: "Corrected calcium within reference range (8.5–10.5 mg/dL).",
    recommendationCode: "CA_CORR_NORMAL",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof CalciumCorrectedInputs> = {
  id: "calcium-corrected",
  inputs: CalciumCorrectedInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 2, max: 20 },
  specialty: "endocrinology",
  i18nKey: "calciumCorrected",
  references: [
    {
      pmid: "4758544",
      citation:
        "Payne RB, Little AJ, Williams RB, Milner JR. Interpretation of serum calcium in patients with abnormal serum proteins. BMJ. 1973;4(5893):643-646.",
    },
  ],
};
