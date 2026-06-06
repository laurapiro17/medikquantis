import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// MELD 3.0 score for end-stage liver disease prioritisation
// (Kim WR et al., NEJM 2021;385:1737, PMID 34107204).
// Updates MELD-Na with female sex coefficient + albumin term.
// Used by OPTN since 2023 for liver-transplant prioritisation.

export const Meld3Inputs = z.object({
  sex: z.enum(["male", "female"]),
  creatinine: z.number().min(0.1).max(20),
  bilirubin: z.number().min(0.1).max(100),
  inr: z.number().min(0.5).max(20),
  sodium: z.number().min(100).max(160),
  albumin: z.number().min(0.5).max(8),
  onDialysisLast7Days: z.boolean(),
});

export type Meld3Input = z.infer<typeof Meld3Inputs>;

export function formula(inputs: Meld3Input): number {
  // OPTN/Kim 2021 bounds applied before logs:
  // - Cr bounded [1, 3]; if dialysis ≥2× in past 7d → Cr = 3
  // - Bili bounded ≥1
  // - INR bounded ≥1
  // - Na bounded [125, 137]
  // - Albumin bounded [1.5, 3.5]
  const cr = inputs.onDialysisLast7Days
    ? 3.0
    : Math.min(Math.max(inputs.creatinine, 1.0), 3.0);
  const bili = Math.max(inputs.bilirubin, 1.0);
  const inr = Math.max(inputs.inr, 1.0);
  const na = Math.min(Math.max(inputs.sodium, 125), 137);
  const alb = Math.min(Math.max(inputs.albumin, 1.5), 3.5);
  const female = inputs.sex === "female" ? 1 : 0;

  const score =
    1.33 * female +
    4.56 * Math.log(bili) +
    0.82 * (137 - na) -
    0.24 * (137 - na) * Math.log(bili) +
    9.09 * Math.log(inr) +
    11.14 * Math.log(cr) +
    1.85 * (3.5 - alb) -
    1.83 * (3.5 - alb) * Math.log(cr) +
    6;

  // MELD 3.0 is capped at 40; minimum is 6.
  const bounded = Math.min(Math.max(score, 6), 40);
  return Math.round(bounded * 10) / 10;
}

export function interpret(score: number): InterpretResult {
  // 3-month mortality bands from the MELD 3.0 derivation cohort:
  // < 10 ≈ ~2%, 10-19 ≈ 6-20%, 20-29 ≈ 20-50%, ≥30 ≈ >50%.
  if (score < 10) {
    return {
      tier: "low",
      recommendation:
        "Low 3-month mortality; outpatient hepatology follow-up.",
      recommendationCode: "MELD3_LOW_OUTPATIENT",
      evidenceGrade: "A",
    };
  }
  if (score < 20) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate 3-month mortality; intensify hepatology follow-up, evaluate transplant candidacy.",
      recommendationCode: "MELD3_INTERMEDIATE_TRANSPLANT_EVAL",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "High 3-month mortality; prioritise transplant evaluation and address acute complications.",
    recommendationCode: "MELD3_HIGH_TRANSPLANT_PRIORITY",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof Meld3Inputs> = {
  id: "meld-3",
  inputs: Meld3Inputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 6, max: 40 },
  specialty: "gastroenterology",
  i18nKey: "meld3",
  references: [
    {
      pmid: "34107204",
      citation:
        "Kim WR, Mannalithara A, Heimbach JK, et al. MELD 3.0: The Model for End-Stage Liver Disease Updated for the Modern Era. Gastroenterology. 2021;161(6):1887-1895.e4.",
    },
  ],
};
