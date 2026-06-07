import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// APACHE II — Acute Physiology and Chronic Health Evaluation II (Knaus
// WA et al. 1985, PMID 3928249). Total = sum of 12 Acute Physiology
// subscores (each 0-4) + Age points + Chronic Health points.
//
// To keep the data-entry burden manageable on a bedside form, every
// physiology subscore is entered directly. The score range is 0-71;
// hospital mortality rises from ~4 % at score 0-4 to > 80 % at ≥ 35.

const Sub04 = z.number().int().min(0).max(4);

export const Apache2Inputs = z.object({
  // 12 Acute Physiology subscores (each 0-4) — the bedside nurse will
  // typically have these pre-computed against the Knaus 1985 table.
  temperature: Sub04,
  meanArterialPressure: Sub04,
  heartRate: Sub04,
  respiratoryRate: Sub04,
  oxygenation: Sub04, // A-aDO2 if FiO2 ≥ 0.5; otherwise PaO2
  arterialPh: Sub04,
  sodium: Sub04,
  potassium: Sub04,
  creatinine: Sub04, // double if acute renal failure
  hematocrit: Sub04,
  whiteCellCount: Sub04,
  glasgowComaScore: z.number().int().min(0).max(12),
  // Age points (0-6): <44=0, 45-54=2, 55-64=3, 65-74=5, ≥75=6
  agePoints: z.number().int().min(0).max(6),
  // Chronic health points (0-5):
  //   2 = elective postoperative + severe chronic organ insufficiency
  //   5 = non-operative or emergency postop + chronic organ insufficiency
  chronicHealthPoints: z.number().int().min(0).max(5),
});

export type Apache2Input = z.infer<typeof Apache2Inputs>;

export function formula(inputs: Apache2Input): number {
  const aps =
    inputs.temperature + inputs.meanArterialPressure + inputs.heartRate +
    inputs.respiratoryRate + inputs.oxygenation + inputs.arterialPh +
    inputs.sodium + inputs.potassium + inputs.creatinine +
    inputs.hematocrit + inputs.whiteCellCount + inputs.glasgowComaScore;
  return aps + inputs.agePoints + inputs.chronicHealthPoints;
}

export function interpret(score: number): InterpretResult {
  // Knaus 1985 mortality bands (non-operative patients, approximate):
  //   0-4  : ~4 %      5-9  : ~8 %      10-14: ~15 %
  //  15-19 : ~25 %    20-24 : ~40 %     25-29: ~55 %
  //  30-34 : ~75 %    ≥ 35  : ~85 %
  if (score <= 9) {
    return {
      tier: "low", annualRiskPercent: score <= 4 ? 4 : 8,
      recommendation: "Low APACHE II (≤ 9). Routine ICU monitoring; reassess every 24 h.",
      recommendationCode: "APACHE2_LOW", evidenceGrade: "A",
    };
  }
  if (score <= 19) {
    return {
      tier: "moderate", annualRiskPercent: score <= 14 ? 15 : 25,
      recommendation: "Moderate APACHE II (10-19). Hospital mortality ~15-25 %; full ICU support and serial APACHE trend.",
      recommendationCode: "APACHE2_MODERATE", evidenceGrade: "A",
    };
  }
  if (score <= 29) {
    return {
      tier: "high", annualRiskPercent: score <= 24 ? 40 : 55,
      recommendation: "High APACHE II (20-29). Mortality 40-55 %; multidisciplinary input and goals-of-care discussion.",
      recommendationCode: "APACHE2_HIGH", evidenceGrade: "A",
    };
  }
  return {
    tier: "high", annualRiskPercent: score <= 34 ? 75 : 85,
    recommendation: "Very high APACHE II (≥ 30). Mortality ≥ 75 %; consider limitation of life-sustaining treatment within a shared decision-making process.",
    recommendationCode: "APACHE2_VERY_HIGH", evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof Apache2Inputs> = {
  id: "apache-2",
  inputs: Apache2Inputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 71 },
  specialty: "intensive_care",
  i18nKey: "apache2",
  references: [
    {
      pmid: "3928249",
      citation:
        "Knaus WA, Draper EA, Wagner DP, Zimmerman JE. APACHE II: a severity of disease classification system. Crit Care Med. 1985;13(10):818-829.",
    },
  ],
};
