import { describe, it, expect } from "vitest";
import { formula, interpret, EhraInputs, type EhraClassValue } from "../src/ehra";

const cases: EhraClassValue[] = ["I", "IIa", "IIb", "III", "IV"];

describe("EHRA formula (ordinal mapping)", () => {
  it("maps each class to a monotonically increasing ordinal", () => {
    const ordinals = cases.map((cls) => formula({ ehraClass: cls }));
    expect(ordinals).toEqual([1, 2, 3, 4, 5]);
  });

  it("ordinal is strictly increasing by severity", () => {
    const ordinals = cases.map((cls) => formula({ ehraClass: cls }));
    for (let i = 1; i < ordinals.length; i++) {
      expect(ordinals[i]).toBeGreaterThan(ordinals[i - 1]!);
    }
  });
});

describe("EHRA input schema", () => {
  it("accepts all five canonical classes", () => {
    for (const cls of cases) {
      const result = EhraInputs.safeParse({ ehraClass: cls });
      expect(result.success).toBe(true);
    }
  });

  it("rejects unknown class strings", () => {
    const result = EhraInputs.safeParse({ ehraClass: "V" });
    expect(result.success).toBe(false);
  });
});

describe("EHRA interpret() tier mapping", () => {
  it("class I → low (no symptoms)", () => {
    const r = interpret(1, { ehraClass: "I" });
    expect(r.tier).toBe("low");
    expect(r.classLabel).toBe("I");
    expect(r.recommendation).toMatch(/no symptoms/i);
  });

  it("class IIa → low (mild, not affecting activity)", () => {
    const r = interpret(2, { ehraClass: "IIa" });
    expect(r.tier).toBe("low");
    expect(r.classLabel).toBe("IIa");
  });

  it("class IIb → moderate (patient distress, consider rhythm control)", () => {
    const r = interpret(3, { ehraClass: "IIb" });
    expect(r.tier).toBe("moderate");
    expect(r.classLabel).toBe("IIb");
    expect(r.recommendation).toMatch(/distress/i);
  });

  it("class III → high (rhythm control strongly recommended)", () => {
    const r = interpret(4, { ehraClass: "III" });
    expect(r.tier).toBe("high");
    expect(r.classLabel).toBe("III");
    expect(r.recommendation).toMatch(/strongly recommended/i);
  });

  it("class IV → high (urgent intervention)", () => {
    const r = interpret(5, { ehraClass: "IV" });
    expect(r.tier).toBe("high");
    expect(r.classLabel).toBe("IV");
    expect(r.recommendation).toMatch(/urgent/i);
  });

  it("does not surface an annualRiskPercent (not applicable)", () => {
    for (const cls of cases) {
      const r = interpret(formula({ ehraClass: cls }), { ehraClass: cls });
      expect(r.annualRiskPercent).toBeUndefined();
    }
  });
});
