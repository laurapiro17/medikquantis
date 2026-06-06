import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/findrisc";

const lowRisk = {
  ageBand: "lt_45" as const,
  bmiBand: "lt_25" as const,
  waistBand: "low" as const,
  dailyPhysicalActivity30Min: true,
  dailyFruitsOrVegetables: true,
  antihypertensiveMedication: false,
  historyOfHighBloodGlucose: false,
  familyHistoryOfDiabetes: "none" as const,
};

describe("FINDRISC", () => {
  it("scores 0 for a young, fit, family-history-free patient", () => {
    expect(formula(lowRisk)).toBe(0);
  });
  it("adds 2 for sedentary lifestyle", () => {
    expect(formula({ ...lowRisk, dailyPhysicalActivity30Min: false })).toBe(2);
  });
  it("adds 5 for prior hyperglycaemia history", () => {
    expect(formula({ ...lowRisk, historyOfHighBloodGlucose: true })).toBe(5);
  });
  it("tiers Lindström 2003 bands", () => {
    expect(interpret(5).recommendationCode).toBe("FINDRISC_LOW");
    expect(interpret(9).recommendationCode).toBe("FINDRISC_SLIGHTLY_ELEVATED");
    expect(interpret(13).recommendationCode).toBe("FINDRISC_MODERATE");
    expect(interpret(18).recommendationCode).toBe("FINDRISC_HIGH");
    expect(interpret(22).recommendationCode).toBe("FINDRISC_VERY_HIGH");
  });
});
