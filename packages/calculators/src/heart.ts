import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// HEART score for chest pain risk stratification (Backus 2013).
// Five categorical inputs, each contributing 0, 1, or 2 points → score 0..10.

export const HeartInputs = z.object({
  history: z.enum([
    "slightly_suspicious",
    "moderately_suspicious",
    "highly_suspicious",
  ]),
  ecg: z.enum([
    "normal",
    "non_specific_repolarization",
    "significant_st_depression",
  ]),
  age: z.enum(["lt_45", "45_to_64", "gte_65"]),
  riskFactors: z.enum(["none", "1_or_2", "3_or_more_or_history"]),
  troponin: z.enum(["normal", "1_to_3x_normal", "gt_3x_normal"]),
});

export type HeartInput = z.infer<typeof HeartInputs>;

// Each field maps its enum value to the canonical HEART point value.
// Keeping this as a typed record per field makes the formula self-documenting
// and the JSON schema for i18n labels symmetrical.
const points = {
  history: {
    slightly_suspicious: 0,
    moderately_suspicious: 1,
    highly_suspicious: 2,
  },
  ecg: {
    normal: 0,
    non_specific_repolarization: 1,
    significant_st_depression: 2,
  },
  age: {
    lt_45: 0,
    "45_to_64": 1,
    gte_65: 2,
  },
  riskFactors: {
    none: 0,
    "1_or_2": 1,
    "3_or_more_or_history": 2,
  },
  troponin: {
    normal: 0,
    "1_to_3x_normal": 1,
    "gt_3x_normal": 2,
  },
} as const satisfies {
  [K in keyof HeartInput]: Record<HeartInput[K], number>;
};

export function formula(inputs: HeartInput): number {
  return (
    points.history[inputs.history] +
    points.ecg[inputs.ecg] +
    points.age[inputs.age] +
    points.riskFactors[inputs.riskFactors] +
    points.troponin[inputs.troponin]
  );
}

// 6-week MACE rates per Backus et al. 2013 prospective validation
// (PMID 23465250, n=2,440 ED chest-pain patients across 10 Dutch sites).
const maceRateByScore: Record<number, number> = {
  0: 0.9,
  1: 0.9,
  2: 0.9,
  3: 2.5,
  4: 12.0,
  5: 12.0,
  6: 22.7,
  7: 50.1,
  8: 50.1,
  9: 50.1,
  10: 65.2,
};

export function interpret(score: number): InterpretResult {
  const annualRiskPercent = maceRateByScore[score];

  if (score <= 3) {
    return {
      tier: "low",
      recommendation:
        "Low 6-week MACE risk; discharge with outpatient follow-up is reasonable.",
      recommendationCode: "HEART_LOW_DISCHARGE",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }

  if (score <= 6) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate risk; admit for observation and serial troponins.",
      recommendationCode: "HEART_INTERMEDIATE_ADMIT",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }

  return {
    tier: "high",
    recommendation:
      "High risk; early invasive strategy and cardiology consult recommended.",
    recommendationCode: "HEART_HIGH_INVASIVE",
    evidenceGrade: "A",
    annualRiskPercent,
  };
}

export const calculator: CalcDefinition<typeof HeartInputs> = {
  id: "heart",
  inputs: HeartInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 10 },
  specialty: "cardiology",
  i18nKey: "heart",
  references: [
    {
      pmid: "18949301",
      citation:
        "Six AJ, Backus BE, Kelder JC. Chest pain in the emergency room: value of the HEART score. Neth Heart J. 2008;16(6):191-196.",
    },
    {
      pmid: "23465250",
      citation:
        "Backus BE, Six AJ, Kelder JC, et al. A prospective validation of the HEART score for chest pain patients at the emergency department. Int J Cardiol. 2013;168(3):2153-2158.",
    },
  ],
};
