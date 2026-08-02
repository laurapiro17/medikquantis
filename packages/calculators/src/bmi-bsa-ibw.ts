import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

export const BmiBsaIbwInputs = z.object({
  heightCm: z.number().min(50).max(250),
  weightKg: z.number().min(10).max(350),
  sex: z.enum(["male", "female"]),
});

export type BmiBsaIbwInput = z.infer<typeof BmiBsaIbwInputs>;

export function formula(inputs: BmiBsaIbwInput): number {
  const heightM = inputs.heightCm / 100;
  const bmi = inputs.weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export interface BmiBsaIbwDetails {
  bmi: number;
  bsaMosteller: number;
  bsaDuBois: number;
  ibwDevine: number;
  abw: number;
}

export function calculateDetails(inputs: BmiBsaIbwInput): BmiBsaIbwDetails {
  const heightM = inputs.heightCm / 100;
  const bmi = Math.round((inputs.weightKg / (heightM * heightM)) * 10) / 10;

  // Mosteller BSA = sqrt((cm * kg) / 3600)
  const bsaMosteller =
    Math.round(Math.sqrt((inputs.heightCm * inputs.weightKg) / 3600) * 100) /
    100;

  // DuBois BSA = 0.007184 * cm^0.725 * kg^0.425
  const bsaDuBois =
    Math.round(
      0.007184 *
        Math.pow(inputs.heightCm, 0.725) *
        Math.pow(inputs.weightKg, 0.425) *
        100
    ) / 100;

  // Devine IBW
  const heightInches = inputs.heightCm / 2.54;
  const inchesOver60 = Math.max(0, heightInches - 60);
  const baseIbw = inputs.sex === "male" ? 50 : 45.5;
  const ibwDevine = Math.round((baseIbw + 2.3 * inchesOver60) * 10) / 10;

  // Adjusted Body Weight = IBW + 0.4 * (Actual Weight - IBW)
  const abw =
    inputs.weightKg > ibwDevine
      ? Math.round((ibwDevine + 0.4 * (inputs.weightKg - ibwDevine)) * 10) / 10
      : inputs.weightKg;

  return {
    bmi,
    bsaMosteller,
    bsaDuBois,
    ibwDevine,
    abw,
  };
}

export interface BmiBsaIbwInterpretResult extends InterpretResult {
  details: BmiBsaIbwDetails;
  category:
    | "underweight"
    | "normal"
    | "overweight"
    | "obese_1"
    | "obese_2"
    | "obese_3";
}

export function interpret(
  score: number,
  inputs: BmiBsaIbwInput
): BmiBsaIbwInterpretResult {
  const details = calculateDetails(inputs);

  if (score < 18.5) {
    return {
      category: "underweight",
      tier: "moderate",
      recommendation:
        "Underweight (BMI < 18.5 kg/m²). Evaluate for malnutrition, eating disorders, or underlying chronic disease.",
      recommendationCode: "BMI_UNDERWEIGHT",
      evidenceGrade: "A",
      details,
    };
  }

  if (score <= 24.9) {
    return {
      category: "normal",
      tier: "low",
      recommendation:
        "Normal body weight (BMI 18.5–24.9 kg/m²). Encourage healthy lifestyle and balanced nutrition.",
      recommendationCode: "BMI_NORMAL",
      evidenceGrade: "A",
      details,
    };
  }

  if (score <= 29.9) {
    return {
      category: "overweight",
      tier: "moderate",
      recommendation:
        "Overweight (BMI 25.0–29.9 kg/m²). Recommend dietary modification, regular physical activity, and cardiovascular risk assessment.",
      recommendationCode: "BMI_OVERWEIGHT",
      evidenceGrade: "A",
      details,
    };
  }

  if (score <= 34.9) {
    return {
      category: "obese_1",
      tier: "high",
      recommendation:
        "Class I Obesity (BMI 30.0–34.9 kg/m²). Intensive lifestyle intervention recommended; evaluate metabolic comorbidities.",
      recommendationCode: "BMI_OBESE_1",
      evidenceGrade: "A",
      details,
    };
  }

  if (score <= 39.9) {
    return {
      category: "obese_2",
      tier: "high",
      recommendation:
        "Class II Obesity (BMI 35.0–39.9 kg/m²). Comprehensive weight management including pharmacotherapy evaluation.",
      recommendationCode: "BMI_OBESE_2",
      evidenceGrade: "A",
      details,
    };
  }

  return {
    category: "obese_3",
    tier: "high",
    recommendation:
      "Class III Severe Obesity (BMI ≥ 40.0 kg/m²). High metabolic/cardiovascular risk; consider bariatric multidisciplinary evaluation.",
    recommendationCode: "BMI_OBESE_3",
    evidenceGrade: "A",
    details,
  };
}

export const calculator: CalcDefinition<typeof BmiBsaIbwInputs> = {
  id: "bmi-bsa-ibw",
  inputs: BmiBsaIbwInputs,
  formula,
  interpret: (score, inputs) => interpret(score, inputs),
  scoreRange: { min: 10, max: 80 },
  specialty: "endocrinology",
  i18nKey: "bmiBsaIbw",
  references: [
    {
      pmid: "3657876",
      citation:
        "Mosteller RD. Simplified calculation of body-surface area. N Engl J Med. 1987;317(17):1098.",
    },
    {
      // Not indexed in PubMed — no PMID exists for this reference.
      citation:
        "Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974;8:650-655.",
    },
  ],
};
