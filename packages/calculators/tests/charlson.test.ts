import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/charlson";

const empty = {
  ageYears: 40,
  myocardialInfarction: false,
  congestiveHeartFailure: false,
  peripheralVascularDisease: false,
  cerebrovascularDisease: false,
  dementia: false,
  chronicPulmonaryDisease: false,
  connectiveTissueDisease: false,
  pepticUlcerDisease: false,
  mildLiverDisease: false,
  diabetesUncomplicated: false,
  hemiplegia: false,
  moderateSevereRenalDisease: false,
  diabetesWithEndOrganDamage: false,
  anyTumorPast5Years: false,
  leukemia: false,
  lymphoma: false,
  moderateSevereLiverDisease: false,
  metastaticSolidTumor: false,
  aids: false,
};

describe("Charlson Comorbidity Index", () => {
  it("scores 0 for a young patient with no comorbidities", () => {
    expect(formula(empty)).toBe(0);
  });

  it("adds the correct weight per comorbidity", () => {
    expect(formula({ ...empty, myocardialInfarction: true })).toBe(1);
    expect(formula({ ...empty, anyTumorPast5Years: true })).toBe(2);
    expect(formula({ ...empty, moderateSevereLiverDisease: true })).toBe(3);
    expect(formula({ ...empty, metastaticSolidTumor: true })).toBe(6);
  });

  it("adds age bonus of 1 per decade from 50", () => {
    expect(formula({ ...empty, ageYears: 49 })).toBe(0);
    expect(formula({ ...empty, ageYears: 55 })).toBe(1);
    expect(formula({ ...empty, ageYears: 65 })).toBe(2);
    expect(formula({ ...empty, ageYears: 80 })).toBe(4);
    expect(formula({ ...empty, ageYears: 99 })).toBe(4); // capped at 4
  });

  it("tiers 0-2 as low, 3-4 moderate, ≥5 high", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(2).tier).toBe("low");
    expect(interpret(3).tier).toBe("moderate");
    expect(interpret(4).tier).toBe("moderate");
    expect(interpret(5).tier).toBe("high");
  });

  it("reports decreasing 10-year survival with rising score", () => {
    const s0 = interpret(0).annualRiskPercent ?? 0;
    const s5 = interpret(5).annualRiskPercent ?? 0;
    expect(s5).toBeGreaterThan(s0);
  });
});
