import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Braden Scale for pressure ulcer risk (Bergstrom N, Braden BJ et al.
// 1987, PMID 3299278). Six subscales: five scored 1–4 (sensory
// perception, moisture, activity, mobility, nutrition) and one scored 1–3
// (friction & shear). Total 6–23. Lower scores indicate higher risk and
// gate facility prevention bundles.

const score14 = z.enum(["1", "2", "3", "4"]);
const score13 = z.enum(["1", "2", "3"]);
type Score14 = z.infer<typeof score14>;
type Score13 = z.infer<typeof score13>;

export const BradenInputs = z.object({
  sensoryPerception: score14,
  moisture: score14,
  activity: score14,
  mobility: score14,
  nutrition: score14,
  frictionAndShear: score13,
});

export type BradenInput = z.infer<typeof BradenInputs>;

export function formula(inputs: BradenInput): number {
  const n = (v: Score14 | Score13) => parseInt(v, 10);
  return (
    n(inputs.sensoryPerception) +
    n(inputs.moisture) +
    n(inputs.activity) +
    n(inputs.mobility) +
    n(inputs.nutrition) +
    n(inputs.frictionAndShear)
  );
}

export function interpret(score: number): InterpretResult {
  // Bergstrom/Braden cut-offs (adult acute care):
  //  ≥19 no risk, 15–18 mild, 13–14 moderate, 10–12 high, ≤9 severe
  if (score >= 19) {
    return {
      tier: "low",
      recommendation:
        "Braden ≥19: no specific pressure-ulcer prevention needed beyond standard care.",
      recommendationCode: "BRADEN_NO_RISK",
      evidenceGrade: "A",
    };
  }
  if (score >= 15) {
    return {
      tier: "low",
      recommendation:
        "Braden 15–18: mild risk. Regular repositioning and skin assessment, address moisture and nutrition.",
      recommendationCode: "BRADEN_MILD",
      evidenceGrade: "A",
    };
  }
  if (score >= 13) {
    return {
      tier: "moderate",
      recommendation:
        "Braden 13–14: moderate risk. Add pressure-redistribution surface; 30° lateral position rotation.",
      recommendationCode: "BRADEN_MODERATE",
      evidenceGrade: "A",
    };
  }
  if (score >= 10) {
    return {
      tier: "high",
      recommendation:
        "Braden 10–12: high risk. Specialist mattress, dietetics input, intensify repositioning to ≤2 hours.",
      recommendationCode: "BRADEN_HIGH",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Braden ≤9: very high risk. Maximum prevention bundle; tissue viability nurse referral.",
    recommendationCode: "BRADEN_VERY_HIGH",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof BradenInputs> = {
  id: "braden",
  inputs: BradenInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 6, max: 23 },
  specialty: "geriatrics",
  i18nKey: "braden",
  references: [
    {
      pmid: "3299278",
      citation:
        "Bergstrom N, Braden BJ, Laguzza A, Holman V. The Braden Scale for predicting pressure sore risk. Nurs Res. 1987;36(4):205-210.",
    },
  ],
};
