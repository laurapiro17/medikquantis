import { describe, it, expect } from "vitest";
import { formula, interpret, type PercInput } from "../src/perc";

const baseline: PercInput = {
  ageOver50: false,
  heartRateOver100: false,
  oxygenSaturationBelow95: false,
  hemoptysis: false,
  estrogenUse: false,
  previousDvtOrPe: false,
  unilateralLegSwelling: false,
  recentSurgeryOrTrauma: false,
};

describe("PERC formula", () => {
  it("all negative → score 0 (PERC-negative)", () => {
    expect(formula(baseline)).toBe(0);
  });

  it("each positive criterion adds 1", () => {
    expect(formula({ ...baseline, ageOver50: true })).toBe(1);
    expect(formula({ ...baseline, hemoptysis: true })).toBe(1);
    expect(formula({ ...baseline, previousDvtOrPe: true })).toBe(1);
  });

  it("max is 8 (all positive)", () => {
    expect(formula({
      ageOver50: true,
      heartRateOver100: true,
      oxygenSaturationBelow95: true,
      hemoptysis: true,
      estrogenUse: true,
      previousDvtOrPe: true,
      unilateralLegSwelling: true,
      recentSurgeryOrTrauma: true,
    })).toBe(8);
  });
});

describe("PERC interpretation (binary rule-out)", () => {
  it("score 0 → PERC-negative, low tier, PE ruled out (with low pretest)", () => {
    const r = interpret(0);
    expect(r.tier).toBe("low");
    expect(r.recommendation).toMatch(/perc-negative/i);
    expect(r.recommendation).toMatch(/ruled out/i);
  });

  it("score ≥1 → PERC-positive, high tier, further testing needed", () => {
    expect(interpret(1).tier).toBe("high");
    expect(interpret(4).tier).toBe("high");
    expect(interpret(8).tier).toBe("high");
    expect(interpret(1).recommendation).toMatch(/d-dimer|imaging/i);
  });
});
