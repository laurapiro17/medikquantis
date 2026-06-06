import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Wells score for pulmonary embolism (Wells PS et al., 2000, PMID 10744147).
// Seven weighted boolean criteria summed into a single score 0-12.5.
// Two-tier interpretation (ESC 2019 PE Guidelines): ≤4 unlikely vs >4 likely.

export const WellsPeInputs = z.object({
  clinicalSignsOfDvt: z.boolean(),
  peAsLikelyAsAlternative: z.boolean(),
  heartRateOver100: z.boolean(),
  immobilizationOrSurgeryLast4Weeks: z.boolean(),
  previousDvtOrPe: z.boolean(),
  hemoptysis: z.boolean(),
  activeOrTreatedMalignancy: z.boolean(),
});

export type WellsPeInput = z.infer<typeof WellsPeInputs>;

export function formula(inputs: WellsPeInput): number {
  let score = 0;
  if (inputs.clinicalSignsOfDvt) score += 3;
  if (inputs.peAsLikelyAsAlternative) score += 3;
  if (inputs.heartRateOver100) score += 1.5;
  if (inputs.immobilizationOrSurgeryLast4Weeks) score += 1.5;
  if (inputs.previousDvtOrPe) score += 1.5;
  if (inputs.hemoptysis) score += 1;
  if (inputs.activeOrTreatedMalignancy) score += 1;
  return score;
}

export function interpret(score: number): InterpretResult {
  // Two-tier modified Wells (ESC 2019 / current standard):
  //   ≤ 4  → PE unlikely (apply d-dimer; if negative, PE excluded)
  //   > 4  → PE likely   (proceed directly to CT pulmonary angiography)
  if (score <= 4) {
    return {
      tier: "low",
      recommendation:
        "PE unlikely; obtain D-dimer. If negative, pulmonary embolism is excluded.",
      recommendationCode: "WELLSPE_UNLIKELY_DDIMER",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "PE likely; proceed directly to CT pulmonary angiography (no need for D-dimer).",
    recommendationCode: "WELLSPE_LIKELY_CTPA",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof WellsPeInputs> = {
  id: "wells-pe",
  inputs: WellsPeInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 12.5 },
  specialty: "emergency",
  i18nKey: "wellsPe",
  references: [
    {
      pmid: "10744147",
      citation:
        "Wells PS, Anderson DR, Rodger M, et al. Derivation of a simple clinical model to categorize patients probability of pulmonary embolism. Thromb Haemost. 2000;83(3):416-420.",
    },
    {
      pmid: "31504429",
      citation:
        "Konstantinides SV, Meyer G, Becattini C, et al. 2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism. Eur Heart J. 2020;41(4):543-603.",
    },
  ],
};
