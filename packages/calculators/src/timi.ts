import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// TIMI Risk Score for unstable angina / NSTEMI (Antman EM et al. 2000,
// JAMA 284:835, PMID 10938172). Seven binary criteria, each +1 point.
// Predicts 14-day composite of all-cause mortality, new/recurrent MI,
// or severe ischaemia prompting urgent revascularization.

export const TimiInputs = z.object({
  ageOver65: z.boolean(),
  threeOrMoreCadRiskFactors: z.boolean(),
  knownCoronaryStenosis: z.boolean(),
  aspirinInLast7Days: z.boolean(),
  severeAnginaInLast24h: z.boolean(),
  elevatedCardiacMarkers: z.boolean(),
  stDeviationAtLeastHalfMm: z.boolean(),
});

export type TimiInput = z.infer<typeof TimiInputs>;

export function formula(inputs: TimiInput): number {
  let score = 0;
  if (inputs.ageOver65) score += 1;
  if (inputs.threeOrMoreCadRiskFactors) score += 1;
  if (inputs.knownCoronaryStenosis) score += 1;
  if (inputs.aspirinInLast7Days) score += 1;
  if (inputs.severeAnginaInLast24h) score += 1;
  if (inputs.elevatedCardiacMarkers) score += 1;
  if (inputs.stDeviationAtLeastHalfMm) score += 1;
  return score;
}

// 14-day primary endpoint rates per Antman 2000 derivation table
// (TIMI 11B + ESSENCE pooled cohorts).
const fourteenDayMaceByScore: Record<number, number> = {
  0: 4.7,
  1: 4.7,
  2: 8.3,
  3: 13.2,
  4: 19.9,
  5: 26.2,
  6: 40.9,
  7: 40.9,
};

export function interpret(score: number): InterpretResult {
  const annualRiskPercent = fourteenDayMaceByScore[score];

  if (score <= 2) {
    return {
      tier: "low",
      recommendation:
        "Low 14-day MACE risk; conservative strategy is reasonable.",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }

  if (score <= 4) {
    return {
      tier: "moderate",
      recommendation:
        "Intermediate risk; early invasive strategy should be considered.",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }

  return {
    tier: "high",
    recommendation:
      "High risk; urgent invasive strategy and cardiology referral.",
    evidenceGrade: "A",
    annualRiskPercent,
  };
}

export const calculator: CalcDefinition<typeof TimiInputs> = {
  id: "timi",
  inputs: TimiInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 7 },
  specialty: "cardiology",
  i18nKey: "timi",
  references: [
    {
      pmid: "10938172",
      citation:
        "Antman EM, Cohen M, Bernink PJLM, et al. The TIMI risk score for unstable angina/non-ST elevation MI: a method for prognostication and therapeutic decision making. JAMA. 2000;284(7):835-842.",
    },
    {
      pmid: "39210723",
      citation:
        "Van Gelder IC, Rienstra M, Bunting KV, et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024;45(36):3314-3414.",
    },
  ],
};
