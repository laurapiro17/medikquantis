import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Cockcroft-Gault Creatinine Clearance Equation
// (Cockcroft DW, Gault MH. Nephron 1976;16:31-41, PMID 1244564).
// CrCl (mL/min) = [ (140 - age) x weight (kg) ] / [ 72 x Scr (mg/dL) ] (x 0.85 if female)

export const CockcroftGaultInputs = z.object({
  age: z.number().int().min(18).max(120),
  sex: z.enum(["male", "female"]),
  weight: z.number().min(30).max(250),
  creatinine: z.number().min(0.2).max(15),
});

export type CockcroftGaultInput = z.infer<typeof CockcroftGaultInputs>;

export function formula(inputs: CockcroftGaultInput): number {
  const genderFactor = inputs.sex === "female" ? 0.85 : 1.0;
  const crcl =
    (((140 - inputs.age) * inputs.weight) / (72 * inputs.creatinine)) *
    genderFactor;
  return Math.round(crcl * 10) / 10;
}

export function interpret(score: number): InterpretResult {
  if (score >= 90) {
    return {
      tier: "low",
      recommendation:
        "Normal creatinine clearance (≥ 90 mL/min). Standard drug dosing suitable unless patient has other risk factors.",
      recommendationCode: "CG_NORMAL",
      evidenceGrade: "A",
    };
  }
  if (score >= 60) {
    return {
      tier: "low",
      recommendation:
        "Mild renal impairment (60–89 mL/min). Monitor kidney function and check package inserts for narrow therapeutic index drugs.",
      recommendationCode: "CG_MILD",
      evidenceGrade: "A",
    };
  }
  if (score >= 30) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate renal impairment (30–59 mL/min). Dose reduction or extended interval required for renally excreted medications.",
      recommendationCode: "CG_MODERATE",
      evidenceGrade: "A",
    };
  }
  if (score >= 15) {
    return {
      tier: "high",
      recommendation:
        "Severe renal impairment (15–29 mL/min). Significant dose adjustment required; avoid nephrotoxic agents.",
      recommendationCode: "CG_SEVERE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Renal failure / End-stage (< 15 mL/min). Specialized dosing for ESRD/dialysis required; nephrology consultation indicated.",
    recommendationCode: "CG_FAILURE",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof CockcroftGaultInputs> = {
  id: "cockcroft-gault",
  inputs: CockcroftGaultInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 200 },
  specialty: "nephrology",
  i18nKey: "cockcroftGault",
  references: [
    {
      pmid: "1244564",
      citation:
        "Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16(1):31-41.",
    },
  ],
};
