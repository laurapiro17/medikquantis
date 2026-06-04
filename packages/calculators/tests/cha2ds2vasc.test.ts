import { describe, it, expect } from "vitest";
import {
  formula,
  interpret,
  Cha2ds2vascInputs,
  type Cha2ds2vascInput,
} from "../src/cha2ds2vasc";

const baseline: Cha2ds2vascInput = {
  age: 50,
  sex: "male",
  chf: false,
  hypertension: false,
  diabetes: false,
  strokeOrTia: false,
  vascularDisease: false,
};

describe("CHA2DS2-VASc formula", () => {
  it("returns 0 for a 50-year-old man with no risk factors", () => {
    expect(formula(baseline)).toBe(0);
  });

  it("returns 1 for a 50-year-old woman with no other risk factors", () => {
    expect(formula({ ...baseline, sex: "female" })).toBe(1);
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

  it("max score for a 76-year-old woman with all factors is 9", () => {
    const score = formula({
      age: 76,
      sex: "female",
      chf: true,
      hypertension: true,
      diabetes: true,
      strokeOrTia: true,
      vascularDisease: true,
    });
    expect(score).toBe(9);
  });

  it("typical AFiB case: 78F with HTN+DM, no prior stroke = 5", () => {
    const score = formula({
      age: 78,
      sex: "female",
      chf: false,
      hypertension: true,
      diabetes: true,
      strokeOrTia: false,
      vascularDisease: false,
    });
    expect(score).toBe(5);
  });
});

describe("CHA2DS2-VASc input schema", () => {
  it("rejects ages below 18", () => {
    const result = Cha2ds2vascInputs.safeParse({ ...baseline, age: 17 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer age", () => {
    const result = Cha2ds2vascInputs.safeParse({ ...baseline, age: 50.5 });
    expect(result.success).toBe(false);
  });

  it("accepts a valid AFiB patient profile", () => {
    const result = Cha2ds2vascInputs.safeParse(baseline);
    expect(result.success).toBe(true);
  });
});

describe("CHA2DS2-VASc interpret()", () => {
  it("score 0 (man, no risk factors) → low, no anticoagulation", () => {
    const r = interpret(0, baseline);
    expect(r.tier).toBe("low");
    expect(r.recommendation).toMatch(/not recommended/i);
    expect(r.annualRiskPercent).toBe(0.2);
  });

  it("score 1 male with CHF → moderate, consider OAC", () => {
    const inputs = { ...baseline, chf: true };
    const r = interpret(formula(inputs), inputs);
    expect(r.tier).toBe("moderate");
    expect(r.recommendation).toMatch(/considered/i);
  });

  it("female sex-only score 1 → low, NO anticoagulation (ESC edge case)", () => {
    const inputs: Cha2ds2vascInput = { ...baseline, sex: "female" };
    const r = interpret(formula(inputs), inputs);
    expect(r.tier).toBe("low");
    expect(r.recommendation).toMatch(/not recommended/i);
  });

  it("female score 2 (sex + CHF) → moderate, consider OAC", () => {
    const inputs: Cha2ds2vascInput = { ...baseline, sex: "female", chf: true };
    const r = interpret(formula(inputs), inputs);
    expect(r.tier).toBe("moderate");
  });

  it("male score 2 (CHF + HTN) → high, OAC recommended", () => {
    const inputs = { ...baseline, chf: true, hypertension: true };
    const r = interpret(formula(inputs), inputs);
    expect(r.tier).toBe("high");
    expect(r.recommendation).toMatch(/recommended/i);
  });

  it("score 9 maximal → high, annual risk ≈ 12.2%", () => {
    const inputs: Cha2ds2vascInput = {
      age: 76,
      sex: "female",
      chf: true,
      hypertension: true,
      diabetes: true,
      strokeOrTia: true,
      vascularDisease: true,
    };
    const r = interpret(formula(inputs), inputs);
    expect(r.tier).toBe("high");
    expect(r.annualRiskPercent).toBe(12.2);
  });

  it("annual risk table matches Friberg 2012 reference values", () => {
    expect(interpret(0, baseline).annualRiskPercent).toBe(0.2);
    expect(interpret(2, { ...baseline, chf: true, hypertension: true }).annualRiskPercent).toBe(2.2);
    expect(interpret(5, {
      ...baseline, age: 65, chf: true, hypertension: true,
      diabetes: true, vascularDisease: true,
    }).annualRiskPercent).toBe(7.2);
  });
});
