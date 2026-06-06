import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Alvarado score for acute appendicitis (Alvarado A 1986, PMID 3963537).
// MANTRELS mnemonic: 8 criteria, total 0–10. Two criteria (RLQ
// tenderness and leukocytosis) carry 2 points; the others carry 1.

export const AlvaradoInputs = z.object({
  migrationOfPain: z.boolean(),
  anorexia: z.boolean(),
  nauseaOrVomiting: z.boolean(),
  rightLowerQuadrantTenderness: z.boolean(),
  reboundTenderness: z.boolean(),
  elevatedTemperature: z.boolean(),
  leukocytosis: z.boolean(),
  leftShift: z.boolean(),
});

export type AlvaradoInput = z.infer<typeof AlvaradoInputs>;

export function formula(inputs: AlvaradoInput): number {
  let score = 0;
  if (inputs.migrationOfPain) score += 1;
  if (inputs.anorexia) score += 1;
  if (inputs.nauseaOrVomiting) score += 1;
  if (inputs.rightLowerQuadrantTenderness) score += 2;
  if (inputs.reboundTenderness) score += 1;
  if (inputs.elevatedTemperature) score += 1;
  if (inputs.leukocytosis) score += 2;
  if (inputs.leftShift) score += 1;
  return score;
}

export function interpret(score: number): InterpretResult {
  if (score <= 4) {
    return {
      tier: "low",
      recommendation:
        "Appendicitis unlikely; consider discharge with safety-net advice and alternative diagnoses.",
      recommendationCode: "ALVARADO_LOW",
      evidenceGrade: "A",
    };
  }
  if (score <= 6) {
    return {
      tier: "moderate",
      recommendation:
        "Possible appendicitis; admit for observation, serial exams and consider cross-sectional imaging.",
      recommendationCode: "ALVARADO_POSSIBLE",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Probable to very probable appendicitis; surgical consultation and definitive management indicated.",
    recommendationCode: "ALVARADO_PROBABLE",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof AlvaradoInputs> = {
  id: "alvarado",
  inputs: AlvaradoInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 10 },
  specialty: "emergency",
  i18nKey: "alvarado",
  references: [
    {
      pmid: "3963537",
      citation:
        "Alvarado A. A practical score for the early diagnosis of acute appendicitis. Ann Emerg Med. 1986;15(5):557-564.",
    },
  ],
};
