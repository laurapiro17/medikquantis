import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Revised Harris-Benedict basal metabolic rate (Roza AM, Shizgal HM 1984,
// Am J Clin Nutr 40:168, PMID 6741850). Returns BMR in kcal/day. Patient
// supplies activity level → the form derives the total daily energy
// expenditure (TDEE) by multiplying BMR by an activity factor.

export const ActivityLevel = z.enum([
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
]);
export type ActivityLevelValue = z.infer<typeof ActivityLevel>;

export const HarrisBenedictInputs = z.object({
  sex: z.enum(["male", "female"]),
  weightKg: z.number().min(20).max(300),
  heightCm: z.number().min(100).max(250),
  ageYears: z.number().int().min(18).max(120),
  activityLevel: ActivityLevel,
});

export type HarrisBenedictInput = z.infer<typeof HarrisBenedictInputs>;

const activityFactor: Record<ActivityLevelValue, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Roza 1984 revision (more accurate than the 1919 original).
//   male:   BMR = 88.362 + 13.397·W + 4.799·H − 5.677·A
//   female: BMR = 447.593 + 9.247·W + 3.098·H − 4.330·A
export function formula(inputs: HarrisBenedictInput): number {
  const bmr =
    inputs.sex === "male"
      ? 88.362 +
        13.397 * inputs.weightKg +
        4.799 * inputs.heightCm -
        5.677 * inputs.ageYears
      : 447.593 +
        9.247 * inputs.weightKg +
        3.098 * inputs.heightCm -
        4.330 * inputs.ageYears;
  return Math.round(bmr);
}

interface HarrisBenedictInterpretResult extends InterpretResult {
  bmrKcal: number;
  tdeeKcal: number;
  activityFactor: number;
}

export function interpret(
  score: number,
  inputs: HarrisBenedictInput,
): HarrisBenedictInterpretResult {
  const af = activityFactor[inputs.activityLevel];
  const tdee = Math.round(score * af);
  return {
    bmrKcal: score,
    tdeeKcal: tdee,
    activityFactor: af,
    tier: "low",
    recommendation: `Basal metabolic rate ${score} kcal/day; total daily energy expenditure approximately ${tdee} kcal/day at the chosen activity level.`,
    recommendationCode: "HB_TDEE_INFO",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof HarrisBenedictInputs> = {
  id: "harris-benedict",
  inputs: HarrisBenedictInputs,
  formula,
  interpret: (score, inputs) => interpret(score, inputs),
  scoreRange: { min: 800, max: 4000 },
  specialty: "endocrinology",
  i18nKey: "harrisBenedict",
  references: [
    {
      pmid: "6741850",
      citation:
        "Roza AM, Shizgal HM. The Harris Benedict equation reevaluated: resting energy requirements and the body cell mass. Am J Clin Nutr. 1984;40(1):168-182.",
    },
  ],
};
