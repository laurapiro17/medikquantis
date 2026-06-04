import { describe, it, expect } from "vitest";
import { formula, interpret, type HasBledInput } from "../src/hasbled";

const baseline: HasBledInput = {
  age: 50,
  uncontrolledHypertension: false,
  abnormalRenalFunction: false,
  abnormalLiverFunction: false,
  strokeHistory: false,
  bleedingHistoryOrPredisposition: false,
  labileInr: false,
  drugsPredisposingToBleeding: false,
  alcoholExcess: false,
};

describe("HAS-BLED formula", () => {
  it("returns 0 for a 50-year-old with no risk factors", () => {
    expect(formula(baseline)).toBe(0);
  });

  it("each binary factor contributes 1 point", () => {
    expect(formula({ ...baseline, uncontrolledHypertension: true })).toBe(1);
    expect(formula({ ...baseline, abnormalRenalFunction: true })).toBe(1);
    expect(formula({ ...baseline, strokeHistory: true })).toBe(1);
    expect(formula({ ...baseline, labileInr: true })).toBe(1);
  });

  it("age >65 contributes 1 point (boundary)", () => {
    expect(formula({ ...baseline, age: 65 })).toBe(0);
    expect(formula({ ...baseline, age: 66 })).toBe(1);
    expect(formula({ ...baseline, age: 80 })).toBe(1);
  });

  it("max score is 9 with all factors", () => {
    const score = formula({
      age: 80,
      uncontrolledHypertension: true,
      abnormalRenalFunction: true,
      abnormalLiverFunction: true,
      strokeHistory: true,
      bleedingHistoryOrPredisposition: true,
      labileInr: true,
      drugsPredisposingToBleeding: true,
      alcoholExcess: true,
    });
    expect(score).toBe(9);
  });

  it("typical AFiB case: 72yo with HTA + renal + prior bleeding = 4", () => {
    const score = formula({
      ...baseline,
      age: 72,
      uncontrolledHypertension: true,
      abnormalRenalFunction: true,
      bleedingHistoryOrPredisposition: true,
    });
    expect(score).toBe(4);
  });
});

describe("HAS-BLED interpret()", () => {
  it("score 0 → low, OAC not precluded", () => {
    const r = interpret(0);
    expect(r.tier).toBe("low");
    expect(r.recommendation).toMatch(/not precluded/i);
  });

  it("score 2 → still low", () => {
    expect(interpret(2).tier).toBe("low");
  });

  it("score 3 → moderate, review reversible factors", () => {
    const r = interpret(3);
    expect(r.tier).toBe("moderate");
    expect(r.recommendation).toMatch(/reversible/i);
  });

  it("score 4 → high, closer follow-up", () => {
    const r = interpret(4);
    expect(r.tier).toBe("high");
    expect(r.recommendation).toMatch(/follow-up/i);
  });

  it("includes annual bleeding risk per Pisters 2010", () => {
    expect(interpret(0).annualRiskPercent).toBe(1.13);
    expect(interpret(3).annualRiskPercent).toBe(3.74);
    expect(interpret(4).annualRiskPercent).toBe(8.7);
  });
});
