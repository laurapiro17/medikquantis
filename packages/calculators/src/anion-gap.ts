import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Anion gap (Emmett M, Narins RG 1977, PMID 401925). Difference between
// measured cations and anions:
//   AG = Na − (Cl + HCO3)
// Normal reference (modern assays) ≈ 6–12 mEq/L. An elevated AG suggests
// the presence of unmeasured anions — the differential is MUDPILES
// (methanol, uraemia, DKA, paraldehyde, isoniazid, lactate, ethylene
// glycol, salicylates).
//
// Albumin is the dominant unmeasured anion; severe hypoalbuminaemia
// (frequent in ICU) lowers the AG independent of acidaemia. Optional
// Figge 1998 correction (PMID 9824071) shifts AG by 2.5 × (4 − albumin
// g/dL) to keep the reference range comparable.

export const AnionGapInputs = z.object({
  sodiumMEqL: z.number().min(100).max(180),
  chlorideMEqL: z.number().min(50).max(140),
  bicarbonateMEqL: z.number().min(0).max(50),
  albuminGDl: z.number().min(0.5).max(8).optional(),
});

export type AnionGapInput = z.infer<typeof AnionGapInputs>;

export function formula(inputs: AnionGapInput): number {
  let ag = inputs.sodiumMEqL - (inputs.chlorideMEqL + inputs.bicarbonateMEqL);
  if (inputs.albuminGDl !== undefined) {
    // Figge 1998 albumin correction. Reference albumin = 4.0 g/dL.
    ag += 2.5 * (4 - inputs.albuminGDl);
  }
  return Math.round(ag * 10) / 10;
}

interface AnionGapInterpretResult extends InterpretResult {
  category: "low" | "normal" | "elevated";
}

export function interpret(score: number): AnionGapInterpretResult {
  // Reference 6–12 mEq/L. Values <6 suggest hypoalbuminaemia or rarely
  // bromide/lithium intoxication; >12 raises concern for an
  // unmeasured-anion (high-AG) metabolic acidosis.
  if (score < 6) {
    return {
      category: "low",
      tier: "low",
      recommendation:
        "Low anion gap. Most often artifactual or due to hypoalbuminaemia; rarely lithium, bromide, multiple myeloma.",
      recommendationCode: "AG_LOW",
      evidenceGrade: "B",
    };
  }
  if (score <= 12) {
    return {
      category: "normal",
      tier: "low",
      recommendation: "Normal anion gap (6–12 mEq/L).",
      recommendationCode: "AG_NORMAL",
      evidenceGrade: "A",
    };
  }
  return {
    category: "elevated",
    tier: "high",
    recommendation:
      "Elevated anion gap. Work up high-AG metabolic acidosis (MUDPILES: methanol, uraemia, DKA, paraldehyde, INH, lactate, ethylene glycol, salicylates).",
    recommendationCode: "AG_ELEVATED",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof AnionGapInputs> = {
  id: "anion-gap",
  inputs: AnionGapInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: -20, max: 60 },
  specialty: "nephrology",
  i18nKey: "anionGap",
  references: [
    {
      pmid: "401925",
      citation:
        "Emmett M, Narins RG. Clinical use of the anion gap. Medicine (Baltimore). 1977;56(1):38-54.",
    },
    {
      pmid: "9824071",
      citation:
        "Figge J, Jabor A, Kazda A, Fencl V. Anion gap and hypoalbuminemia. Crit Care Med. 1998;26(11):1807-1810.",
    },
  ],
};
