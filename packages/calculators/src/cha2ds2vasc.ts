import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

export const Cha2ds2vascInputs = z.object({
  age: z.number().int().min(18).max(120),
  sex: z.enum(["male", "female"]),
  chf: z.boolean(),
  hypertension: z.boolean(),
  diabetes: z.boolean(),
  strokeOrTia: z.boolean(),
  vascularDisease: z.boolean(),
});

export type Cha2ds2vascInput = z.infer<typeof Cha2ds2vascInputs>;

export function formula(inputs: Cha2ds2vascInput): number {
  let score = 0;
  if (inputs.chf) score += 1;
  if (inputs.hypertension) score += 1;
  if (inputs.age >= 75) score += 2;
  else if (inputs.age >= 65) score += 1;
  if (inputs.diabetes) score += 1;
  if (inputs.strokeOrTia) score += 2;
  if (inputs.vascularDisease) score += 1;
  if (inputs.sex === "female") score += 1;
  return score;
}

// Annual stroke risk per Friberg et al. 2012 (n=90,490 Swedish AFiB cohort,
// PMID 22717718). Kept as the most widely cited reference table.
const annualRiskByScore: Record<number, number> = {
  0: 0.2,
  1: 0.6,
  2: 2.2,
  3: 3.2,
  4: 4.8,
  5: 7.2,
  6: 9.7,
  7: 11.2,
  8: 10.8,
  9: 12.2,
};

export function interpret(
  score: number,
  inputs: Cha2ds2vascInput,
): InterpretResult {
  const annualRiskPercent = annualRiskByScore[score];

  // ESC: female sex is a risk modifier, not an independent indication.
  // A woman whose only point comes from being female is clinically
  // equivalent to a man with score 0 — no anticoagulation indicated.
  const sexOnly =
    score === 1 &&
    inputs.sex === "female" &&
    !inputs.chf &&
    !inputs.hypertension &&
    !inputs.diabetes &&
    !inputs.strokeOrTia &&
    !inputs.vascularDisease &&
    inputs.age < 65;

  if (score === 0 || sexOnly) {
    return {
      tier: "low",
      recommendation: "Oral anticoagulation not recommended.",
      recommendationCode: "CHA2DS2VASC_OAC_NOT_RECOMMENDED",
      evidenceGrade: "A",
      annualRiskPercent,
    };
  }

  // Score = 1 in men, or = 2 in women, sits in the "consider" band
  // (ESC Class IIa — anticoagulation should be considered).
  if (
    (inputs.sex === "male" && score === 1) ||
    (inputs.sex === "female" && score === 2)
  ) {
    return {
      tier: "moderate",
      recommendation:
        "Oral anticoagulation should be considered (ESC Class IIa).",
      recommendationCode: "CHA2DS2VASC_OAC_CONSIDERED_IIA",
      evidenceGrade: "B",
      annualRiskPercent,
    };
  }

  return {
    tier: "high",
    recommendation: "Oral anticoagulation is recommended (ESC Class I).",
    recommendationCode: "CHA2DS2VASC_OAC_RECOMMENDED_I",
    evidenceGrade: "A",
    annualRiskPercent,
  };
}

export const calculator: CalcDefinition<typeof Cha2ds2vascInputs> = {
  id: "cha2ds2vasc",
  inputs: Cha2ds2vascInputs,
  formula,
  interpret,
  scoreRange: { min: 0, max: 9 },
  specialty: "cardiology",
  i18nKey: "cha2ds2vasc",
  references: [
    {
      pmid: "20299623",
      citation:
        "Lip GYH, Nieuwlaat R, Pisters R, Lane DA, Crijns HJGM. Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation using a novel risk factor-based approach: the Euro Heart Survey on atrial fibrillation. Chest. 2010;137(2):263-272.",
    },
    {
      pmid: "39210723",
      citation:
        "Van Gelder IC, Rienstra M, Bunting KV, et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024;45(36):3314-3414.",
    },
  ],
};
