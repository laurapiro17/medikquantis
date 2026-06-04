import { describe, it, expect } from "vitest";
import { formula, interpret, type OrbitInput } from "../src/orbit";

const baseline: OrbitInput = {
  age: 50,
  reducedHemoglobinOrHematocrit: false,
  bleedingHistory: false,
  reducedRenalFunction: false,
  antiplateletTreatment: false,
};

describe("ORBIT formula", () => {
  it("returns 0 for a 50yo with no risk factors", () => {
    expect(formula(baseline)).toBe(0);
  });

  it("age ≥75 contributes 1 point (boundary at 75)", () => {
    expect(formula({ ...baseline, age: 74 })).toBe(0);
    expect(formula({ ...baseline, age: 75 })).toBe(1);
    expect(formula({ ...baseline, age: 90 })).toBe(1);
  });

  it("anemia (Hgb/Hct reduced) contributes 2 points", () => {
    expect(formula({ ...baseline, reducedHemoglobinOrHematocrit: true })).toBe(2);
  });

  it("prior bleeding history contributes 2 points", () => {
    expect(formula({ ...baseline, bleedingHistory: true })).toBe(2);
  });

  it("reduced renal function (GFR <60) contributes 1 point", () => {
    expect(formula({ ...baseline, reducedRenalFunction: true })).toBe(1);
  });

  it("antiplatelet treatment contributes 1 point", () => {
    expect(formula({ ...baseline, antiplateletTreatment: true })).toBe(1);
  });

  it("max score is 7 with every factor", () => {
    const score = formula({
      age: 80,
      reducedHemoglobinOrHematocrit: true,
      bleedingHistory: true,
      reducedRenalFunction: true,
      antiplateletTreatment: true,
    });
    expect(score).toBe(7);
  });

  it("typical AFiB case: 78yo + anemia + GFR <60 = 4", () => {
    const score = formula({
      ...baseline,
      age: 78,
      reducedHemoglobinOrHematocrit: true,
      reducedRenalFunction: true,
    });
    expect(score).toBe(4);
  });
});

describe("ORBIT interpret()", () => {
  it("score 0-2 → low risk", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(2).tier).toBe("low");
    expect(interpret(0).annualRiskPercent).toBe(2.4);
  });

  it("score 3 → moderate risk", () => {
    const r = interpret(3);
    expect(r.tier).toBe("moderate");
    expect(r.annualRiskPercent).toBe(4.7);
    expect(r.recommendation).toMatch(/reversible/i);
  });

  it("score ≥4 → high risk", () => {
    const r = interpret(4);
    expect(r.tier).toBe("high");
    expect(r.annualRiskPercent).toBe(8.1);
    expect(interpret(7).tier).toBe("high");
  });

  it("annual risk values match O'Brien 2015 reference table", () => {
    expect(interpret(0).annualRiskPercent).toBe(2.4);
    expect(interpret(3).annualRiskPercent).toBe(4.7);
    expect(interpret(5).annualRiskPercent).toBe(8.1);
  });
});
