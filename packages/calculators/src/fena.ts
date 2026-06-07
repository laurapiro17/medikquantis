import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Fractional excretion of sodium (Espinel CH 1976, PMID 947239).
// Distinguishes prerenal from intrinsic acute kidney injury by comparing
// the renal handling of sodium and creatinine.
//
//   FENa (%) = (UrineNa × PlasmaCreatinine) / (PlasmaNa × UrineCreatinine) × 100
//
// • < 1 %  → prerenal (volume depletion, low effective circulating volume)
// • > 2 %  → intrinsic (acute tubular necrosis)
// • 1–2 %  → indeterminate; consider FEUrea, especially if patient on
//             diuretics where the FENa is unreliable.

export const FenaInputs = z.object({
  urineSodiumMEqL: z.number().min(0).max(300),
  plasmaSodiumMEqL: z.number().min(100).max(180),
  urineCreatinineMgDl: z.number().min(0.1).max(500),
  plasmaCreatinineMgDl: z.number().min(0.1).max(20),
});

export type FenaInput = z.infer<typeof FenaInputs>;

export function formula(inputs: FenaInput): number {
  const numerator = inputs.urineSodiumMEqL * inputs.plasmaCreatinineMgDl;
  const denominator = inputs.plasmaSodiumMEqL * inputs.urineCreatinineMgDl;
  const fena = (numerator / denominator) * 100;
  return Math.round(fena * 100) / 100;
}

interface FenaInterpretResult extends InterpretResult {
  category: "prerenal" | "indeterminate" | "intrinsic";
}

export function interpret(score: number): FenaInterpretResult {
  if (score < 1) {
    return {
      category: "prerenal",
      tier: "moderate",
      recommendation:
        "FENa < 1 % suggests prerenal AKI. Restore effective circulating volume; reassess after fluid challenge. NOTE: also < 1 % in contrast nephropathy, glomerulonephritis and hepatorenal syndrome.",
      recommendationCode: "FENA_PRERENAL",
      evidenceGrade: "A",
    };
  }
  if (score <= 2) {
    return {
      category: "indeterminate",
      tier: "moderate",
      recommendation:
        "FENa 1–2 % is indeterminate. On diuretics, FENa is unreliable — use FEUrea (< 35 % supports prerenal).",
      recommendationCode: "FENA_INDETERMINATE",
      evidenceGrade: "B",
    };
  }
  return {
    category: "intrinsic",
    tier: "high",
    recommendation:
      "FENa > 2 % suggests intrinsic AKI (most commonly acute tubular necrosis). Search for ischaemic or nephrotoxic insult; nephrology input.",
    recommendationCode: "FENA_INTRINSIC",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof FenaInputs> = {
  id: "fena",
  inputs: FenaInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 100 },
  specialty: "nephrology",
  i18nKey: "fena",
  references: [
    {
      pmid: "947239",
      citation:
        "Espinel CH. The FENa test: use in the differential diagnosis of acute renal failure. JAMA. 1976;236(6):579-581.",
    },
  ],
};
