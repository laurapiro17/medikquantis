import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// SCORAD — Scoring Atopic Dermatitis (European Task Force on Atopic
// Dermatitis 1993, PMID 8435513). Composite of:
//   A = extent of involvement (0–100 % body surface area)
//   B = sum of 6 intensity items, each 0–3 (erythema, oedema/papules,
//       exudate/crusting, excoriations, lichenification, dryness)
//   C = subjective symptoms (pruritus + sleep loss, each 0–10 mm VAS)
//   Total SCORAD = A/5 + 7B/2 + C (range 0–103)

const Intensity = z.number().int().min(0).max(3);
const Vas10 = z.number().min(0).max(10);

export const ScoradInputs = z.object({
  extentPercent: z.number().min(0).max(100),
  // B — six intensity items, each 0–3
  erythema: Intensity,
  edemaPapules: Intensity,
  exudateCrusts: Intensity,
  excoriations: Intensity,
  lichenification: Intensity,
  dryness: Intensity,
  // C — two subjective VAS (0–10)
  pruritus: Vas10,
  sleepLoss: Vas10,
});

export type ScoradInput = z.infer<typeof ScoradInputs>;

export function formula(inputs: ScoradInput): number {
  const a = inputs.extentPercent / 5;
  const b =
    ((inputs.erythema +
      inputs.edemaPapules +
      inputs.exudateCrusts +
      inputs.excoriations +
      inputs.lichenification +
      inputs.dryness) *
      7) /
    2;
  const c = inputs.pruritus + inputs.sleepLoss;
  return Math.round((a + b + c) * 10) / 10;
}

export function interpret(score: number): InterpretResult {
  // Kunz 1997 cut-offs (universally cited): <25 mild, 25–50 moderate,
  // >50 severe. >50 is the biologic-eligibility benchmark in EMA labels.
  if (score < 25) {
    return {
      tier: "low",
      recommendation:
        "Mild atopic dermatitis. Emollients plus low-potency topical steroids during flares usually suffice.",
      recommendationCode: "SCORAD_MILD",
      evidenceGrade: "A",
    };
  }
  if (score <= 50) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate atopic dermatitis. Use mid- to high-potency topical steroids or calcineurin inhibitors; consider proactive maintenance.",
      recommendationCode: "SCORAD_MODERATE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Severe atopic dermatitis. Consider systemic therapy (phototherapy, ciclosporin) or biologics (dupilumab, JAK inhibitors).",
    recommendationCode: "SCORAD_SEVERE",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof ScoradInputs> = {
  id: "scorad",
  inputs: ScoradInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 103 },
  specialty: "dermatology",
  i18nKey: "scorad",
  references: [
    {
      pmid: "8435513",
      citation:
        "European Task Force on Atopic Dermatitis. Severity scoring of atopic dermatitis: the SCORAD index. Dermatology. 1993;186(1):23-31.",
    },
  ],
};
