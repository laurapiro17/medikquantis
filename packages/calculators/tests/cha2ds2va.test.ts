import { describe, it, expect } from "vitest";
import {
  formula,
  interpret,
  Cha2ds2vaInputs,
  type Cha2ds2vaInput,
} from "../src/cha2ds2va";

const baseline: Cha2ds2vaInput = {
  age: 50,
  chf: false,
  hypertension: false,
  diabetes: false,
  strokeOrTia: false,
  vascularDisease: false,
};

describe("CHA2DS2-VA formula", () => {
  it("returns 0 for a 50-year-old with no risk factors", () => {
    expect(formula(baseline)).toBe(0);
  });

  it("has no sex component (50-year-old woman-equivalent inputs still 0)", () => {
    expect(formula(baseline)).toBe(0);
  });

  it("age 65 contributes 1 point", () => {
    expect(formula({ ...baseline, age: 65 })).toBe(1);
  });

  it("age 74 contributes 1 point (boundary)", () => {
    expect(formula({ ...baseline, age: 74 })).toBe(1);
  });

  it("age 75 contributes 2 points (boundary)", () => {
    expect(formula({ ...baseline, age: 75 })).toBe(2);
  });

  it("prior stroke / TIA contributes 2 points", () => {
    expect(formula({ ...baseline, strokeOrTia: true })).toBe(2);
  });

  it("CHF + HTN + DM + Vascular each contribute 1 point", () => {
    const score = formula({
      ...baseline,
      chf: true,
      hypertension: true,
      diabetes: true,
      vascularDisease: true,
    });
    expect(score).toBe(4);
  });

  it("maximum score for a 76-year-old with all factors is 8", () => {
    const score = formula({
      age: 76,
      chf: true,
      hypertension: true,
      diabetes: true,
      strokeOrTia: true,
      vascularDisease: true,
    });
    expect(score).toBe(8);
  });

  it("typical AFiB case: 78 with HTN+DM, no prior stroke = 4", () => {
    const score = formula({
      ...baseline,
      age: 78,
      hypertension: true,
      diabetes: true,
    });
    expect(score).toBe(4);
  });
});

describe("CHA2DS2-VA input schema", () => {
  it("rejects ages below 18", () => {
    const result = Cha2ds2vaInputs.safeParse({ ...baseline, age: 17 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer age", () => {
    const result = Cha2ds2vaInputs.safeParse({ ...baseline, age: 50.5 });
    expect(result.success).toBe(false);
  });

  it("has no sex field (rejects unknown keys is not enforced, but sex is absent)", () => {
    const result = Cha2ds2vaInputs.safeParse(baseline);
    expect(result.success).toBe(true);
    if (result.success) {
      expect("sex" in result.data).toBe(false);
    }
  });
});

describe("CHA2DS2-VA interpret()", () => {
  it("score 0 → low, oral anticoagulation not recommended", () => {
    const r = interpret(0);
    expect(r.tier).toBe("low");
    expect(r.recommendation).toMatch(/not recommended/i);
    expect(r.annualRiskPercent).toBeUndefined();
  });

  it("score 1 → moderate, should be considered (Class IIa)", () => {
    const r = interpret(1);
    expect(r.tier).toBe("moderate");
    expect(r.recommendation).toMatch(/considered/i);
    expect(r.recommendation).toMatch(/IIa/);
  });

  it("score 2 → high, recommended (Class I)", () => {
    const r = interpret(2);
    expect(r.tier).toBe("high");
    expect(r.recommendation).toMatch(/recommended/i);
    expect(r.recommendation).toMatch(/Class I\b/);
  });

  it("score 8 (maximal) → high, recommended", () => {
    const r = interpret(8);
    expect(r.tier).toBe("high");
    expect(r.recommendation).toMatch(/recommended/i);
  });

  it("formula + interpret: 70-year-old with HTN (score 2) → high", () => {
    const inputs = { ...baseline, age: 70, hypertension: true };
    const r = interpret(formula(inputs));
    expect(formula(inputs)).toBe(2);
    expect(r.tier).toBe("high");
  });
});
