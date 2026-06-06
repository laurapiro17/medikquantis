import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// FINDRISC — Finnish Diabetes Risk Score (Lindström J, Tuomilehto J 2003,
// PMID 12610029). Eight weighted questions estimating the 10-year risk of
// developing type 2 diabetes. Validated across multiple European
// populations and recommended by ADA and EASD for opportunistic screening.

export const AgeBand = z.enum(["lt_45", "45_to_54", "55_to_64", "gte_65"]);
export const BmiBand = z.enum(["lt_25", "25_to_30", "gt_30"]);
export const WaistBand = z.enum(["low", "moderate", "high"]);
export const FamilyDiabetes = z.enum(["none", "distant", "close"]);

export const FindriscInputs = z.object({
  ageBand: AgeBand,
  bmiBand: BmiBand,
  waistBand: WaistBand,
  dailyPhysicalActivity30Min: z.boolean(),
  dailyFruitsOrVegetables: z.boolean(),
  antihypertensiveMedication: z.boolean(),
  historyOfHighBloodGlucose: z.boolean(),
  familyHistoryOfDiabetes: FamilyDiabetes,
});

export type FindriscInput = z.infer<typeof FindriscInputs>;

const agePoints = { lt_45: 0, "45_to_54": 2, "55_to_64": 3, gte_65: 4 } as const;
const bmiPoints = { lt_25: 0, "25_to_30": 1, gt_30: 3 } as const;
// Waist bands abstract over sex-specific cut-offs (men 94/102, women 80/88).
const waistPoints = { low: 0, moderate: 3, high: 4 } as const;
const familyPoints = { none: 0, distant: 3, close: 5 } as const;

export function formula(inputs: FindriscInput): number {
  let score = 0;
  score += agePoints[inputs.ageBand];
  score += bmiPoints[inputs.bmiBand];
  score += waistPoints[inputs.waistBand];
  if (!inputs.dailyPhysicalActivity30Min) score += 2;
  if (!inputs.dailyFruitsOrVegetables) score += 1;
  if (inputs.antihypertensiveMedication) score += 2;
  if (inputs.historyOfHighBloodGlucose) score += 5;
  score += familyPoints[inputs.familyHistoryOfDiabetes];
  return score;
}

const tenYearRiskByBand = {
  low: 1,
  slightlyElevated: 4,
  moderate: 17,
  high: 33,
  veryHigh: 50,
} as const;

export function interpret(score: number): InterpretResult {
  // Lindström 2003 published bands:
  //  <7 low (≈1%), 7–11 slightly elevated (≈4%),
  //  12–14 moderate (≈17%), 15–20 high (≈33%), >20 very high (≈50%)
  if (score < 7) {
    return {
      tier: "low",
      recommendation:
        "Low 10-year diabetes risk. Maintain a healthy lifestyle and reassess in a few years.",
      recommendationCode: "FINDRISC_LOW",
      evidenceGrade: "A",
      annualRiskPercent: tenYearRiskByBand.low,
    };
  }
  if (score <= 11) {
    return {
      tier: "low",
      recommendation:
        "Slightly elevated 10-year diabetes risk. Reinforce diet, physical activity and weight control.",
      recommendationCode: "FINDRISC_SLIGHTLY_ELEVATED",
      evidenceGrade: "A",
      annualRiskPercent: tenYearRiskByBand.slightlyElevated,
    };
  }
  if (score <= 14) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate 10-year diabetes risk. Consider fasting glucose or HbA1c testing and lifestyle counselling.",
      recommendationCode: "FINDRISC_MODERATE",
      evidenceGrade: "A",
      annualRiskPercent: tenYearRiskByBand.moderate,
    };
  }
  if (score <= 20) {
    return {
      tier: "high",
      recommendation:
        "High 10-year diabetes risk. Order glucose / HbA1c, consider an oral glucose tolerance test and structured lifestyle intervention.",
      recommendationCode: "FINDRISC_HIGH",
      evidenceGrade: "A",
      annualRiskPercent: tenYearRiskByBand.high,
    };
  }
  return {
    tier: "high",
    recommendation:
      "Very high 10-year diabetes risk (about 1 in 2). Diagnostic testing and intensive lifestyle / pharmacological intervention are warranted.",
    recommendationCode: "FINDRISC_VERY_HIGH",
    evidenceGrade: "A",
    annualRiskPercent: tenYearRiskByBand.veryHigh,
  };
}

export const calculator: CalcDefinition<typeof FindriscInputs> = {
  id: "findrisc",
  inputs: FindriscInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 26 },
  specialty: "endocrinology",
  i18nKey: "findrisc",
  references: [
    {
      pmid: "12610029",
      citation:
        "Lindström J, Tuomilehto J. The diabetes risk score: a practical tool to predict type 2 diabetes risk. Diabetes Care. 2003;26(3):725-731.",
    },
  ],
};
