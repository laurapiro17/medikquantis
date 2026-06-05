import { describe, it, expect } from "vitest";
import {
  formula,
  interpret,
  NyhaInputs,
  type NyhaClassValue,
} from "../src/nyha";

const cases: NyhaClassValue[] = ["I", "II", "III", "IV"];

describe("NYHA formula (ordinal mapping)", () => {
  it("maps each class to its ordinal 1..4", () => {
    expect(cases.map((cls) => formula({ nyhaClass: cls }))).toEqual([1, 2, 3, 4]);
  });

  it("ordinal is strictly increasing by severity", () => {
    const ordinals = cases.map((cls) => formula({ nyhaClass: cls }));
    for (let i = 1; i < ordinals.length; i++) {
      expect(ordinals[i]).toBeGreaterThan(ordinals[i - 1]!);
    }
  });
});

describe("NYHA input schema", () => {
  it("accepts all four canonical classes", () => {
    for (const cls of cases) {
      expect(NyhaInputs.safeParse({ nyhaClass: cls }).success).toBe(true);
    }
  });

  it("rejects non-canonical class strings (e.g. lowercase, Arabic numerals)", () => {
    expect(NyhaInputs.safeParse({ nyhaClass: "1" }).success).toBe(false);
    expect(NyhaInputs.safeParse({ nyhaClass: "i" }).success).toBe(false);
    expect(NyhaInputs.safeParse({ nyhaClass: "V" }).success).toBe(false);
  });
});

describe("NYHA interpret() tier mapping", () => {
  it("class I → low (no symptoms with ordinary activity)", () => {
    const r = interpret(1, { nyhaClass: "I" });
    expect(r.tier).toBe("low");
    expect(r.classLabel).toBe("I");
    expect(r.recommendation).toMatch(/no symptoms/i);
  });

  it("class II → moderate (slight limitation, quadruple therapy)", () => {
    const r = interpret(2, { nyhaClass: "II" });
    expect(r.tier).toBe("moderate");
    expect(r.classLabel).toBe("II");
    expect(r.recommendation).toMatch(/quadruple/i);
  });

  it("class III → high (marked limitation, CRT/ICD consideration)", () => {
    const r = interpret(3, { nyhaClass: "III" });
    expect(r.tier).toBe("high");
    expect(r.classLabel).toBe("III");
    expect(r.recommendation).toMatch(/marked limitation/i);
  });

  it("class IV → high (symptoms at rest, advanced HF therapies)", () => {
    const r = interpret(4, { nyhaClass: "IV" });
    expect(r.tier).toBe("high");
    expect(r.classLabel).toBe("IV");
    expect(r.recommendation).toMatch(/at rest|advanced/i);
  });

  it("does not surface an annualRiskPercent (classification, not risk score)", () => {
    for (const cls of cases) {
      const r = interpret(formula({ nyhaClass: cls }), { nyhaClass: cls });
      expect(r.annualRiskPercent).toBeUndefined();
    }
  });
});
