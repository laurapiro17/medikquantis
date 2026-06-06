import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// LRINEC — Laboratory Risk Indicator for Necrotising Fasciitis
// (Wong CH et al. 2004, PMID 15241098). Six routine lab values binned to
// 0–4 points each. Originally derived to distinguish necrotising fasciitis
// from severe cellulitis on routine labs at presentation.

export const LrinecInputs = z.object({
  crpMgDl: z.number().min(0).max(100), // mg/dL — multiply by 10 for mg/L
  wbcPerMm3: z.number().min(0).max(100000),
  hemoglobinGDl: z.number().min(3).max(25),
  sodiumMEqL: z.number().min(100).max(180),
  creatinineMgDl: z.number().min(0).max(15),
  glucoseMgDl: z.number().min(40).max(2000),
});

export type LrinecInput = z.infer<typeof LrinecInputs>;

export function formula(inputs: LrinecInput): number {
  let score = 0;

  // CRP ≥150 mg/L (= 15 mg/dL) → 4 pts
  if (inputs.crpMgDl >= 15) score += 4;

  // WBC: 15-25 → 1; >25 → 2 (per 10^3/mm^3)
  const wbcThousands = inputs.wbcPerMm3 / 1000;
  if (wbcThousands > 25) score += 2;
  else if (wbcThousands >= 15) score += 1;

  // Hemoglobin: 11-13.5 → 1; <11 → 2
  if (inputs.hemoglobinGDl < 11) score += 2;
  else if (inputs.hemoglobinGDl <= 13.5) score += 1;

  // Sodium <135 → 2
  if (inputs.sodiumMEqL < 135) score += 2;

  // Creatinine >1.6 mg/dL (>141 μmol/L) → 2
  if (inputs.creatinineMgDl > 1.6) score += 2;

  // Glucose >180 mg/dL (>10 mmol/L) → 1
  if (inputs.glucoseMgDl > 180) score += 1;

  return score;
}

export function interpret(score: number): InterpretResult {
  // Wong 2004 bands: ≤5 low (<50% PPV), 6-7 intermediate (50-75%),
  // ≥8 high (>75%). LRINEC does NOT rule out necrotising fasciitis.
  if (score <= 5) {
    return {
      tier: "low",
      recommendation:
        "Low LRINEC; necrotising fasciitis less likely but NOT ruled out. Clinical assessment overrides the score — proceed to surgical exploration if suspicion is high.",
      recommendationCode: "LRINEC_LOW",
      evidenceGrade: "B",
    };
  }
  if (score <= 7) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate LRINEC; high suspicion for necrotising fasciitis. Urgent surgical consultation and imaging consideration.",
      recommendationCode: "LRINEC_INTERMEDIATE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "high",
    recommendation:
      "High LRINEC; strong suspicion for necrotising fasciitis. Immediate broad-spectrum antibiotics and surgical exploration without delay.",
    recommendationCode: "LRINEC_HIGH",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof LrinecInputs> = {
  id: "lrinec",
  inputs: LrinecInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 13 },
  specialty: "infectious_diseases",
  i18nKey: "lrinec",
  references: [
    {
      pmid: "15241098",
      citation:
        "Wong CH, Khin LW, Heng KS, Tan KC, Low CO. The LRINEC (Laboratory Risk Indicator for Necrotizing Fasciitis) score: a tool for distinguishing necrotizing fasciitis from other soft tissue infections. Crit Care Med. 2004;32(7):1535-1541.",
    },
  ],
};
