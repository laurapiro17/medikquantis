import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

export const Cha2ds2vaInputs = z.object({
  age: z.number().int().min(18).max(120),
  chf: z.boolean(),
  hypertension: z.boolean(),
  diabetes: z.boolean(),
  strokeOrTia: z.boolean(),
  vascularDisease: z.boolean(),
});

export type Cha2ds2vaInput = z.infer<typeof Cha2ds2vaInputs>;

// CHA2DS2-VA is the 2024 ESC reformulation of CHA2DS2-VASc that drops the
// sex (Sc) category: identical risk factors and point weights, no point for
// female sex, so the maximum score is 8 instead of 9.
export function formula(inputs: Cha2ds2vaInput): number {
  let score = 0;
  if (inputs.chf) score += 1;
  if (inputs.hypertension) score += 1;
  if (inputs.age >= 75) score += 2;
  else if (inputs.age >= 65) score += 1;
  if (inputs.diabetes) score += 1;
  if (inputs.strokeOrTia) score += 2;
  if (inputs.vascularDisease) score += 1;
  return score;
}

// Thresholds per the 2024 ESC guidelines (Van Gelder et al., PMID 39210723):
// no oral anticoagulation at 0; should be considered at 1 (Class IIa);
// recommended from 2 upward (Class I). No annual-risk table is reported here:
// the original CHA2DS2-VASc per-point risk figures (Friberg 2012) are tied to
// the 9-point score and do not map onto CHA2DS2-VA, so we deliberately omit a
// fabricated rate and let the recommendation carry the interpretation.
export function interpret(score: number): InterpretResult {
  if (score === 0) {
    return {
      tier: "low",
      recommendation: "Oral anticoagulation not recommended.",
      recommendationCode: "CHA2DS2VA_OAC_NOT_RECOMMENDED",
      evidenceGrade: "A",
    };
  }

  if (score === 1) {
    return {
      tier: "moderate",
      recommendation:
        "Oral anticoagulation should be considered (ESC Class IIa).",
      recommendationCode: "CHA2DS2VA_OAC_CONSIDERED_IIA",
      evidenceGrade: "B",
    };
  }

  return {
    tier: "high",
    recommendation: "Oral anticoagulation is recommended (ESC Class I).",
    recommendationCode: "CHA2DS2VA_OAC_RECOMMENDED_I",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof Cha2ds2vaInputs> = {
  id: "cha2ds2va",
  inputs: Cha2ds2vaInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 8 },
  specialty: "cardiology",
  i18nKey: "cha2ds2va",
  references: [
    {
      pmid: "39210723",
      citation:
        "Van Gelder IC, Rienstra M, Bunting KV, et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024;45(36):3314-3414.",
    },
    {
      pmid: "19762550",
      citation:
        "Lip GYH, Nieuwlaat R, Pisters R, Lane DA, Crijns HJGM. Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation using a novel risk factor-based approach: the Euro Heart Survey on atrial fibrillation. Chest. 2010;137(2):263-272.",
    },
  ],
};
