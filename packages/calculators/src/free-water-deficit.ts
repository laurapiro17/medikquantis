import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

export const FreeWaterDeficitInputs = z.object({
  weightKg: z.number().min(20).max(250),
  currentSodiumMEqL: z.number().min(140).max(200),
  targetSodiumMEqL: z.number().min(130).max(145).default(140),
  sex: z.enum(["male", "female"]),
  ageCategory: z.enum(["adult", "elderly"]),
});

export type FreeWaterDeficitInput = z.infer<typeof FreeWaterDeficitInputs>;

export function getTbwFactor(sex: "male" | "female", ageCategory: "adult" | "elderly"): number {
  if (sex === "male") {
    return ageCategory === "adult" ? 0.6 : 0.5;
  }
  return ageCategory === "adult" ? 0.5 : 0.45;
}

export function formula(inputs: FreeWaterDeficitInput): number {
  const tbwFactor = getTbwFactor(inputs.sex, inputs.ageCategory);
  const tbw = inputs.weightKg * tbwFactor;
  const targetNa = inputs.targetSodiumMEqL || 140;
  const deficit = tbw * (inputs.currentSodiumMEqL / targetNa - 1);
  return Math.round(deficit * 10) / 10;
}

export interface FreeWaterDeficitInterpretResult extends InterpretResult {
  tbwLiters: number;
  maxCorrection24h: string;
}

export function interpret(
  score: number,
  inputs: FreeWaterDeficitInput
): FreeWaterDeficitInterpretResult {
  const tbwFactor = getTbwFactor(inputs.sex, inputs.ageCategory);
  const tbwLiters = Math.round(inputs.weightKg * tbwFactor * 10) / 10;

  if (score <= 0) {
    return {
      tier: "low",
      recommendation:
        "No free water deficit calculated (serum sodium is at or below target).",
      recommendationCode: "FWD_NONE",
      evidenceGrade: "A",
      tbwLiters,
      maxCorrection24h: "N/A",
    };
  }

  const tier = score > 4 ? "high" : "moderate";

  return {
    tier,
    recommendation: `Free water deficit is ${score} L. Correct slowly: decrease serum Na⁺ by NO MORE than 8–10 mEq/L per 24 hours (approx. 0.5 mEq/L/hour) to avoid severe cerebral edema. Include ongoing obligate fluid losses in total fluid replacement volume.`,
    recommendationCode: "FWD_DEFICIT_CALCULATED",
    evidenceGrade: "A",
    tbwLiters,
    maxCorrection24h: "Maximum serum Na⁺ reduction: 8–10 mEq/L / 24 hours.",
  };
}

export const calculator: CalcDefinition<typeof FreeWaterDeficitInputs> = {
  id: "free-water-deficit",
  inputs: FreeWaterDeficitInputs,
  formula,
  interpret: (score, inputs) => interpret(score, inputs),
  scoreRange: { min: 0, max: 25 },
  specialty: "nephrology",
  i18nKey: "freeWaterDeficit",
  references: [
    {
      pmid: "10816188",
      citation:
        "Adrogué HJ, Madias NE. Hypernatremia. N Engl J Med. 2000;342(20):1493-1499.",
    },
  ],
};
