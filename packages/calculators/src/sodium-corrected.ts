import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Hyperglycaemia-corrected sodium (Katz MA 1973, NEJM 289:843,
// PMID 4763428). Glucose draws water from the intracellular space into
// the extracellular fluid, diluting plasma sodium; the calculator tells
// you what the sodium would be at a normal glucose. Returns corrected Na
// in mEq/L (= mmol/L).

export const SodiumCorrectedInputs = z.object({
  sodiumMEqL: z.number().min(100).max(180),
  glucoseMgDl: z.number().min(50).max(2000),
});

export type SodiumCorrectedInput = z.infer<typeof SodiumCorrectedInputs>;

// Katz 1973 correction factor: +1.6 mEq/L per 100 mg/dL of glucose above 100.
// (Hillier 1999 proposed 2.4 as a better empirical fit, but Katz remains
// the standard cited in most current ICU and endocrine references.)
export function formula(inputs: SodiumCorrectedInput): number {
  const excessGlucose = Math.max(inputs.glucoseMgDl - 100, 0);
  const corrected = inputs.sodiumMEqL + 1.6 * (excessGlucose / 100);
  return Math.round(corrected * 10) / 10;
}

interface SodiumInterpretResult extends InterpretResult {
  category: "hyponatraemia" | "normal" | "hypernatraemia";
}

export function interpret(score: number): SodiumInterpretResult {
  // Reference range 135–145 mEq/L.
  if (score < 135) {
    return {
      category: "hyponatraemia",
      tier: "moderate",
      recommendation:
        "Corrected sodium suggests true hyponatraemia; classify by tonicity and volume status before treating.",
      recommendationCode: "NA_CORR_HYPO",
      evidenceGrade: "B",
    };
  }
  if (score > 145) {
    return {
      category: "hypernatraemia",
      tier: "high",
      recommendation:
        "Corrected sodium suggests hypernatraemia; assess water deficit and free-water replacement plan.",
      recommendationCode: "NA_CORR_HYPER",
      evidenceGrade: "B",
    };
  }
  return {
    category: "normal",
    tier: "low",
    recommendation:
      "Corrected sodium within reference range; observed hyponatraemia is fully explained by hyperglycaemia.",
    recommendationCode: "NA_CORR_NORMAL",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof SodiumCorrectedInputs> = {
  id: "sodium-corrected",
  inputs: SodiumCorrectedInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 100, max: 180 },
  specialty: "endocrinology",
  i18nKey: "sodiumCorrected",
  references: [
    {
      pmid: "4763428",
      citation:
        "Katz MA. Hyperglycemia-induced hyponatremia: calculation of expected serum sodium depression. N Engl J Med. 1973;289(16):843-844.",
    },
  ],
};
