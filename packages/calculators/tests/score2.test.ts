import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/score2";

describe("SCORE2 / SCORE2-OP", () => {
  it("returns a sensible 10-year risk for a healthy 45-year-old man", () => {
    const r = formula({
      sex: "male", age: 45, smoker: false,
      systolicBpMmHg: 120, totalCholesterolMmolL: 5.0, hdlMmolL: 1.4,
    });
    // Low-risk region, age <50, no risk factors → modest single-digit risk
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(5);
  });

  it("bumps risk for a smoker with elevated SBP and chol", () => {
    const baseline = formula({
      sex: "male", age: 55, smoker: false,
      systolicBpMmHg: 120, totalCholesterolMmolL: 5.0, hdlMmolL: 1.4,
    });
    const enriched = formula({
      sex: "male", age: 55, smoker: true,
      systolicBpMmHg: 160, totalCholesterolMmolL: 7.0, hdlMmolL: 1.0,
    });
    expect(enriched).toBeGreaterThan(baseline);
  });

  it("switches to SCORE2-OP for age ≥ 70", () => {
    const r = formula({
      sex: "female", age: 72, smoker: false,
      systolicBpMmHg: 140, totalCholesterolMmolL: 5.5, hdlMmolL: 1.3,
    });
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThan(100);
  });

  it("tiers per ESC 2021 age-stratified thresholds", () => {
    // Use small synthetic risk numbers to hit each band:
    expect(interpret(2, { sex: "male", age: 45 } as never).tier).toBe("low");
    expect(interpret(4, { sex: "male", age: 45 } as never).tier).toBe("moderate");
    expect(interpret(8, { sex: "male", age: 45 } as never).tier).toBe("high");
    expect(interpret(4, { sex: "male", age: 60 } as never).tier).toBe("low");
    expect(interpret(7, { sex: "male", age: 60 } as never).tier).toBe("moderate");
    expect(interpret(12, { sex: "male", age: 60 } as never).tier).toBe("high");
  });
});
