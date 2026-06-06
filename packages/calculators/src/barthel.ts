import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Barthel Index for activities of daily living (Mahoney FI, Barthel DW
// 1965, PMID 14258950). 10 items with varying maximum scores, total 0–100
// in 5-point increments. Lower scores indicate greater dependence;
// universally used in geriatric and rehabilitation assessment.

const Score010 = z.enum(["0", "5", "10"]);
const Score05 = z.enum(["0", "5"]);
const Score015 = z.enum(["0", "5", "10", "15"]);

export const BarthelInputs = z.object({
  feeding: Score010,
  bathing: Score05,
  grooming: Score05,
  dressing: Score010,
  bowels: Score010,
  bladder: Score010,
  toiletUse: Score010,
  transfers: Score015,
  mobility: Score015,
  stairs: Score010,
});

export type BarthelInput = z.infer<typeof BarthelInputs>;

export function formula(inputs: BarthelInput): number {
  return Object.values(inputs).reduce((sum, v) => sum + parseInt(v, 10), 0);
}

export function interpret(score: number): InterpretResult {
  // Shah 1989 cut-offs (most widely used today):
  //   100 independent · 91–99 mild dependence · 61–90 moderate
  //   21–60 severe · ≤20 total dependence
  if (score >= 100) {
    return {
      tier: "low",
      recommendation:
        "Independent in activities of daily living. No specific support required.",
      recommendationCode: "BARTHEL_INDEPENDENT",
      evidenceGrade: "A",
    };
  }
  if (score >= 91) {
    return {
      tier: "low",
      recommendation:
        "Mild dependence; usually able to live alone with minor help.",
      recommendationCode: "BARTHEL_MILD",
      evidenceGrade: "A",
    };
  }
  if (score >= 61) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate dependence; benefits from daily personal assistance and rehabilitation.",
      recommendationCode: "BARTHEL_MODERATE",
      evidenceGrade: "A",
    };
  }
  if (score >= 21) {
    return {
      tier: "high",
      recommendation:
        "Severe dependence; structured caregiver support and adapted environment required.",
      recommendationCode: "BARTHEL_SEVERE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Total dependence; full-time care plan and continuing-care planning indicated.",
    recommendationCode: "BARTHEL_TOTAL",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof BarthelInputs> = {
  id: "barthel",
  inputs: BarthelInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 100 },
  specialty: "geriatrics",
  i18nKey: "barthel",
  references: [
    {
      pmid: "14258950",
      citation:
        "Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. Md State Med J. 1965;14:61-65.",
    },
    {
      pmid: "2760661",
      citation:
        "Shah S, Vanclay F, Cooper B. Improving the sensitivity of the Barthel Index for stroke rehabilitation. J Clin Epidemiol. 1989;42(8):703-709.",
    },
  ],
};
