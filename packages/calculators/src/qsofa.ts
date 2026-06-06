import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// qSOFA (quick Sepsis-related Organ Failure Assessment) from Sepsis-3
// (Singer M et al., JAMA 2016;315:801, PMID 26903338). Three bedside
// criteria; score ≥2 identifies patients with suspected infection who
// are at high risk of poor outcomes (mortality, prolonged ICU stay).

export const QsofaInputs = z.object({
  alteredMentalStatus: z.boolean(),
  respiratoryRateAtLeast22: z.boolean(),
  systolicBpAtMost100: z.boolean(),
});

export type QsofaInput = z.infer<typeof QsofaInputs>;

export function formula(inputs: QsofaInput): number {
  let score = 0;
  if (inputs.alteredMentalStatus) score += 1;
  if (inputs.respiratoryRateAtLeast22) score += 1;
  if (inputs.systolicBpAtMost100) score += 1;
  return score;
}

export function interpret(score: number): InterpretResult {
  // Sepsis-3 operational threshold:
  //   ≥ 2 criteria → high mortality risk, suspect sepsis / organ dysfunction
  //   1 criterion  → vigilance / serial reassessment
  //   0 criteria   → low immediate concern for organ dysfunction
  if (score >= 2) {
    return {
      tier: "high",
      recommendation:
        "qSOFA ≥2: high suspicion of sepsis-related organ dysfunction. Escalate care, consider full SOFA, lactate, blood cultures, antibiotics.",
      recommendationCode: "QSOFA_HIGH_SEPSIS_SUSPECT",
      evidenceGrade: "A",
    };
  }
  if (score === 1) {
    return {
      tier: "moderate",
      recommendation:
        "Single criterion positive; reassess vital signs serially and remain alert for deterioration.",
      recommendationCode: "QSOFA_MODERATE_VIGILANCE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "low",
    recommendation:
      "No qSOFA criteria; low immediate concern for organ dysfunction. Continue routine assessment.",
    recommendationCode: "QSOFA_LOW_ROUTINE",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof QsofaInputs> = {
  id: "qsofa",
  inputs: QsofaInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 3 },
  specialty: "intensive_care",
  i18nKey: "qsofa",
  references: [
    {
      pmid: "26903338",
      citation:
        "Singer M, Deutschman CS, Seymour CW, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):801-810.",
    },
  ],
};
