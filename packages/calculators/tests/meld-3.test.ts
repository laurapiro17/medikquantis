import { describe, it, expect } from "vitest";
import { formula, interpret, type Meld3Input } from "../src/meld-3";

const baseline: Meld3Input = {
  sex: "male",
  creatinine: 1.0,
  bilirubin: 1.0,
  inr: 1.0,
  sodium: 137,
  albumin: 3.5,
  onDialysisLast7Days: false,
};

describe("MELD 3.0 formula", () => {
  it("baseline (all normal values, male) returns minimum 6", () => {
    expect(formula(baseline)).toBe(6);
  });

  it("baseline female adds 1.33 → ~7.3", () => {
    const score = formula({ ...baseline, sex: "female" });
    expect(score).toBeGreaterThan(7);
    expect(score).toBeLessThan(8);
  });

  it("dialysis forces creatinine to 3.0 (max bound)", () => {
    const noDialysis = formula({ ...baseline, creatinine: 1.5 });
    const onDialysis = formula({ ...baseline, creatinine: 1.5, onDialysisLast7Days: true });
    expect(onDialysis).toBeGreaterThan(noDialysis);
  });

  it("higher bilirubin pushes score up", () => {
    const low = formula({ ...baseline, bilirubin: 1.0 });
    const high = formula({ ...baseline, bilirubin: 10.0 });
    expect(high).toBeGreaterThan(low + 5);
  });

  it("realistic cirrhosis case: female, Cr 1.5, bili 3, INR 1.5, Na 130, alb 3.0 → ~25", () => {
    const score = formula({
      sex: "female",
      creatinine: 1.5,
      bilirubin: 3.0,
      inr: 1.5,
      sodium: 130,
      albumin: 3.0,
      onDialysisLast7Days: false,
    });
    expect(score).toBeGreaterThan(18);
    expect(score).toBeLessThan(30);
  });

  it("score is bounded [6, 40]", () => {
    // Extreme low
    expect(formula(baseline)).toBeGreaterThanOrEqual(6);
    // Extreme high
    const worst = formula({
      sex: "female",
      creatinine: 5.0,
      bilirubin: 50.0,
      inr: 5.0,
      sodium: 120,
      albumin: 1.0,
      onDialysisLast7Days: true,
    });
    expect(worst).toBeLessThanOrEqual(40);
  });
});

describe("MELD 3.0 tiers", () => {
  it("score <10 → low", () => {
    expect(interpret(6).tier).toBe("low");
    expect(interpret(9).tier).toBe("low");
  });

  it("score 10-19 → moderate", () => {
    expect(interpret(10).tier).toBe("moderate");
    expect(interpret(19).tier).toBe("moderate");
  });

  it("score ≥20 → high", () => {
    expect(interpret(20).tier).toBe("high");
    expect(interpret(40).tier).toBe("high");
  });
});
