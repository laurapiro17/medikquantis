import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Norton Scale for pressure ulcer risk (Norton D, McLaren R, Exton-Smith
// AN 1962). Five ordinal items each scored 1–4, total 5–20.
// Lower scores indicate higher risk.

const score14 = z.enum(["1", "2", "3", "4"]);
type Score14 = z.infer<typeof score14>;

export const NortonInputs = z.object({
  physicalCondition: score14, // 4 good → 1 very bad
  mentalCondition: score14, // 4 alert → 1 stuporous
  activity: score14, // 4 ambulant → 1 bedbound
  mobility: score14, // 4 full → 1 immobile
  incontinence: score14, // 4 none → 1 urinary + fecal
});

export type NortonInput = z.infer<typeof NortonInputs>;

export function formula(inputs: NortonInput): number {
  const n = (v: Score14) => parseInt(v, 10);
  return (
    n(inputs.physicalCondition) +
    n(inputs.mentalCondition) +
    n(inputs.activity) +
    n(inputs.mobility) +
    n(inputs.incontinence)
  );
}

export function interpret(score: number): InterpretResult {
  if (score >= 18) {
    return {
      tier: "low",
      recommendation:
        "Norton ≥18: low pressure ulcer risk. Standard skin care and reassessment with clinical changes.",
      recommendationCode: "NORTON_LOW",
      evidenceGrade: "B",
    };
  }
  if (score >= 14) {
    return {
      tier: "moderate",
      recommendation:
        "Norton 14–17: moderate risk. Implement repositioning schedule, support surface and nutrition review.",
      recommendationCode: "NORTON_MODERATE",
      evidenceGrade: "B",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Norton ≤13: high risk. Pressure-redistribution mattress, ≤2-hour repositioning and daily skin inspection.",
    recommendationCode: "NORTON_HIGH",
    evidenceGrade: "B",
  };
}

export const calculator: CalcDefinition<typeof NortonInputs> = {
  id: "norton",
  inputs: NortonInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 5, max: 20 },
  specialty: "geriatrics",
  i18nKey: "norton",
  references: [
    {
      pmid: "8126018",
      citation:
        "Norton D. Calculating the risk: reflections on the Norton Scale. Decubitus. 1989;2(3):24-31.",
    },
  ],
};
