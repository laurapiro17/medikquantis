import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// CKD-EPI 2021 race-free creatinine equation
// (Inker LA et al., NEJM 2021;385:1737-1749, PMID 34554658).
// Returns eGFR in mL/min/1.73 m². Replaces the 2009 race-coefficient version.

export const CkdEpi2021Inputs = z.object({
  age: z.number().int().min(18).max(120),
  sex: z.enum(["male", "female"]),
  creatinine: z.number().min(0.1).max(20),
});

export type CkdEpi2021Input = z.infer<typeof CkdEpi2021Inputs>;

export function formula(inputs: CkdEpi2021Input): number {
  const kappa = inputs.sex === "female" ? 0.7 : 0.9;
  const alpha = inputs.sex === "female" ? -0.241 : -0.302;
  const sexMultiplier = inputs.sex === "female" ? 1.012 : 1.0;
  const ratio = inputs.creatinine / kappa;
  const term1 = Math.pow(Math.min(ratio, 1), alpha);
  const term2 = Math.pow(Math.max(ratio, 1), -1.2);
  const ageTerm = Math.pow(0.9938, inputs.age);
  const egfr = 142 * term1 * term2 * ageTerm * sexMultiplier;
  return Math.round(egfr * 10) / 10;
}

interface CkdEpiInterpretResult extends InterpretResult {
  stage: "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5";
}

export function interpret(score: number): CkdEpiInterpretResult {
  // KDIGO 2024 CKD staging by eGFR
  if (score >= 90) {
    return {
      stage: "G1",
      tier: "low",
      recommendation: "Normal or high eGFR; investigate other CKD markers if persistent abnormalities.",
      recommendationCode: "CKDEPI_G1_NORMAL",
      evidenceGrade: "A",
    };
  }
  if (score >= 60) {
    return {
      stage: "G2",
      tier: "low",
      recommendation: "Mildly decreased eGFR; monitor and address risk factors.",
      recommendationCode: "CKDEPI_G2_MILD",
      evidenceGrade: "A",
    };
  }
  if (score >= 45) {
    return {
      stage: "G3a",
      tier: "moderate",
      recommendation: "Mildly to moderately decreased eGFR; evaluate cause, complications and progression risk.",
      recommendationCode: "CKDEPI_G3A_MILD_MODERATE",
      evidenceGrade: "A",
    };
  }
  if (score >= 30) {
    return {
      stage: "G3b",
      tier: "moderate",
      recommendation: "Moderately to severely decreased eGFR; nephrology referral and management of CKD complications.",
      recommendationCode: "CKDEPI_G3B_MODERATE_SEVERE",
      evidenceGrade: "A",
    };
  }
  if (score >= 15) {
    return {
      stage: "G4",
      tier: "high",
      recommendation: "Severely decreased eGFR; nephrology follow-up, prepare for renal replacement therapy.",
      recommendationCode: "CKDEPI_G4_SEVERE",
      evidenceGrade: "A",
    };
  }
  return {
    stage: "G5",
    tier: "high",
    recommendation: "Kidney failure; renal replacement therapy (dialysis or transplant) indicated.",
    recommendationCode: "CKDEPI_G5_FAILURE",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof CkdEpi2021Inputs> = {
  id: "ckd-epi-2021",
  inputs: CkdEpi2021Inputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 200 },
  specialty: "nephrology",
  i18nKey: "ckdEpi2021",
  references: [
    {
      pmid: "34554658",
      citation:
        "Inker LA, Eneanya ND, Coresh J, et al. New creatinine- and cystatin C-based equations to estimate GFR without race. N Engl J Med. 2021;385(19):1737-1749.",
    },
  ],
};
