import { z } from "zod";
import type { CalcDefinition, InterpretResult } from "./types";

// Caprini Risk Assessment Model for venous thromboembolism (Caprini JA
// 2005 / 2010 update, PMID 20103082). Weighted check-list used to
// stratify surgical and medical inpatients for VTE prophylaxis. Items
// carry 1, 2, 3 or 5 points; clinical cut-offs follow Caprini's
// recommendations.

export const CapriniInputs = z.object({
  // 1-point items
  age41To60: z.boolean(),
  minorSurgery: z.boolean(),
  bmiOver25: z.boolean(),
  swollenLegs: z.boolean(),
  varicoseVeins: z.boolean(),
  sepsisLast1Month: z.boolean(),
  seriousLungDisease: z.boolean(),
  oralContraceptivesOrHrt: z.boolean(),
  pregnancyOrPostpartum: z.boolean(),
  historyOfUnexplainedStillbirth: z.boolean(),
  copd: z.boolean(),
  amiLast1Month: z.boolean(),
  chf: z.boolean(),
  inflammatoryBowelDisease: z.boolean(),
  medicalPatientOnBedrest: z.boolean(),
  // 2-point items
  age61To74: z.boolean(),
  arthroscopicSurgery: z.boolean(),
  majorOpenSurgeryOver45Min: z.boolean(),
  laparoscopicSurgeryOver45Min: z.boolean(),
  malignancy: z.boolean(),
  confinedToBedOver72h: z.boolean(),
  immobilizingPlasterCast: z.boolean(),
  centralVenousAccess: z.boolean(),
  // 3-point items
  ageOver75: z.boolean(),
  historyDvtOrPe: z.boolean(),
  familyHistoryOfThrombosis: z.boolean(),
  thrombophilia: z.boolean(),
  hit: z.boolean(),
  // 5-point items
  strokeLast1Month: z.boolean(),
  electiveMajorLowerExtremityArthroplasty: z.boolean(),
  hipPelvisOrLegFracture: z.boolean(),
  acuteSpinalCordInjuryLast1Month: z.boolean(),
  multipleTraumaLast1Month: z.boolean(),
});

export type CapriniInput = z.infer<typeof CapriniInputs>;

const onePoint: ReadonlyArray<keyof CapriniInput> = [
  "age41To60", "minorSurgery", "bmiOver25", "swollenLegs", "varicoseVeins",
  "sepsisLast1Month", "seriousLungDisease", "oralContraceptivesOrHrt",
  "pregnancyOrPostpartum", "historyOfUnexplainedStillbirth", "copd",
  "amiLast1Month", "chf", "inflammatoryBowelDisease", "medicalPatientOnBedrest",
];
const twoPoints: ReadonlyArray<keyof CapriniInput> = [
  "age61To74", "arthroscopicSurgery", "majorOpenSurgeryOver45Min",
  "laparoscopicSurgeryOver45Min", "malignancy", "confinedToBedOver72h",
  "immobilizingPlasterCast", "centralVenousAccess",
];
const threePoints: ReadonlyArray<keyof CapriniInput> = [
  "ageOver75", "historyDvtOrPe", "familyHistoryOfThrombosis",
  "thrombophilia", "hit",
];
const fivePoints: ReadonlyArray<keyof CapriniInput> = [
  "strokeLast1Month", "electiveMajorLowerExtremityArthroplasty",
  "hipPelvisOrLegFracture", "acuteSpinalCordInjuryLast1Month",
  "multipleTraumaLast1Month",
];

export function formula(inputs: CapriniInput): number {
  let s = 0;
  for (const k of onePoint) if (inputs[k]) s += 1;
  for (const k of twoPoints) if (inputs[k]) s += 2;
  for (const k of threePoints) if (inputs[k]) s += 3;
  for (const k of fivePoints) if (inputs[k]) s += 5;
  return s;
}

export function interpret(score: number): InterpretResult {
  // Caprini-recommended cut-offs:
  // 0 = very low, 1-2 = low, 3-4 = moderate, ≥5 = high.
  if (score === 0) {
    return {
      tier: "low",
      recommendation:
        "Very low VTE risk. Early ambulation alone is usually sufficient.",
      recommendationCode: "CAPRINI_VERY_LOW", evidenceGrade: "A",
    };
  }
  if (score <= 2) {
    return {
      tier: "low",
      recommendation:
        "Low VTE risk. Mechanical prophylaxis (intermittent pneumatic compression) is usually sufficient.",
      recommendationCode: "CAPRINI_LOW", evidenceGrade: "A",
    };
  }
  if (score <= 4) {
    return {
      tier: "moderate",
      recommendation:
        "Moderate VTE risk. Pharmacological prophylaxis (LMWH or low-dose UFH) is recommended unless bleeding risk is prohibitive.",
      recommendationCode: "CAPRINI_MODERATE", evidenceGrade: "A",
    };
  }
  return {
    tier: "high",
    recommendation:
      "High VTE risk. Pharmacological prophylaxis plus mechanical prophylaxis; consider extended-duration prophylaxis in selected surgical patients.",
    recommendationCode: "CAPRINI_HIGH", evidenceGrade: "A",
  };
}

export const calculator: CalcDefinition<typeof CapriniInputs> = {
  id: "caprini",
  inputs: CapriniInputs,
  formula,
  interpret: (score) => interpret(score),
  scoreRange: { min: 0, max: 40 },
  specialty: "surgery",
  i18nKey: "caprini",
  references: [
    {
      pmid: "20103082",
      citation:
        "Caprini JA. Risk assessment as a guide for the prevention of the many faces of venous thromboembolism. Am J Surg. 2010;199(1 Suppl):S3-S10.",
    },
  ],
};
