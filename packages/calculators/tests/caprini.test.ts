import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/caprini";

const allFalse = {
  age41To60: false, minorSurgery: false, bmiOver25: false, swollenLegs: false,
  varicoseVeins: false, sepsisLast1Month: false, seriousLungDisease: false,
  oralContraceptivesOrHrt: false, pregnancyOrPostpartum: false,
  historyOfUnexplainedStillbirth: false, copd: false, amiLast1Month: false,
  chf: false, inflammatoryBowelDisease: false, medicalPatientOnBedrest: false,
  age61To74: false, arthroscopicSurgery: false, majorOpenSurgeryOver45Min: false,
  laparoscopicSurgeryOver45Min: false, malignancy: false, confinedToBedOver72h: false,
  immobilizingPlasterCast: false, centralVenousAccess: false,
  ageOver75: false, historyDvtOrPe: false, familyHistoryOfThrombosis: false,
  thrombophilia: false, hit: false,
  strokeLast1Month: false, electiveMajorLowerExtremityArthroplasty: false,
  hipPelvisOrLegFracture: false, acuteSpinalCordInjuryLast1Month: false,
  multipleTraumaLast1Month: false,
};

describe("Caprini", () => {
  it("scores 0 with no risk factors", () => {
    expect(formula(allFalse)).toBe(0);
  });
  it("weights items at 1/2/3/5 points", () => {
    expect(formula({ ...allFalse, age41To60: true })).toBe(1);
    expect(formula({ ...allFalse, malignancy: true })).toBe(2);
    expect(formula({ ...allFalse, ageOver75: true })).toBe(3);
    expect(formula({ ...allFalse, strokeLast1Month: true })).toBe(5);
  });
  it("tiers 0 very low, 1-2 low, 3-4 moderate, ≥5 high", () => {
    expect(interpret(0).recommendationCode).toBe("CAPRINI_VERY_LOW");
    expect(interpret(2).recommendationCode).toBe("CAPRINI_LOW");
    expect(interpret(4).recommendationCode).toBe("CAPRINI_MODERATE");
    expect(interpret(7).recommendationCode).toBe("CAPRINI_HIGH");
  });
});
