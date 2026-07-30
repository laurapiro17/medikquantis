import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Body Mass Index (BMI) (WHO Classification).
// BMI = Weight (kg) / Height (m)²

export const BmiInputs = z.object({
  height: z.number().min(50).max(250),
  weight: z.number().min(10).max(300),
});

export type BmiInput = z.infer<typeof BmiInputs>;

export function formula(inputs: BmiInput): number {
  const heightM = inputs.height / 100;
  const bmi = inputs.weight / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export function interpret(score: number): InterpretResult {
  if (score < 18.5) {
    return {
      tier: "moderate",
      recommendation:
        "Underweight (< 18.5 kg/m²). Evaluate for nutritional deficiencies, eating disorders, or underlying chronic illness.",
      recommendationCode: "BMI_UNDERWEIGHT",
      evidenceGrade: "A",
    };
  }
  if (score <= 24.9) {
    return {
      tier: "low",
      recommendation:
        "Normal weight (18.5–24.9 kg/m²). Lowest overall cardiometabolic risk; maintain healthy diet and regular exercise.",
      recommendationCode: "BMI_NORMAL",
      evidenceGrade: "A",
    };
  }
  if (score <= 29.9) {
    return {
      tier: "moderate",
      recommendation:
        "Overweight (25.0–29.9 kg/m²). Increased cardiometabolic risk; counsel on lifestyle modifications, exercise, and dietary intervention.",
      recommendationCode: "BMI_OVERWEIGHT",
      evidenceGrade: "A",
    };
  }
  if (score <= 34.9) {
    return {
      tier: "high",
      recommendation:
        "Obesity Class I (30.0–34.9 kg/m²). High cardiometabolic risk; initiate structured weight management program.",
      recommendationCode: "BMI_OBESITY_1",
      evidenceGrade: "A",
    };
  }
  if (score <= 39.9) {
    return {
      tier: "high",
      recommendation:
        "Obesity Class II (35.0–39.9 kg/m²). Very high cardiometabolic risk; evaluate for pharmacotherapy or metabolic surgery.",
      recommendationCode: "BMI_OBESITY_2",
      evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "Obesity Class III (≥ 40.0 kg/m²). Extremely high risk of complications; comprehensive bariatric/multidisciplinary care recommended.",
    recommendationCode: "BMI_OBESITY_3",
    evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof BmiInputs> = {
  id: "bmi",
  inputs: BmiInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 10, max: 70 },
  specialty: "endocrinology",
  i18nKey: "bmi",
  references: [
    {
      pmid: "8594834",
      citation:
        "Physical status: the use and interpretation of anthropometry. Report of a WHO Expert Committee. World Health Organ Tech Rep Ser. 1995;854:1-452.",
    },
  ],
};
