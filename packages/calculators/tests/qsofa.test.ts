import { describe, it, expect } from "vitest";
import { formula, interpret, type QsofaInput } from "../src/qsofa";

const baseline: QsofaInput = {
  alteredMentalStatus: false,
  respiratoryRateAtLeast22: false,
  systolicBpAtMost100: false,
};

describe("qSOFA formula", () => {
  it("baseline returns 0", () => expect(formula(baseline)).toBe(0));

  it("each criterion contributes 1 point", () => {
    expect(formula({ ...baseline, alteredMentalStatus: true })).toBe(1);
    expect(formula({ ...baseline, respiratoryRateAtLeast22: true })).toBe(1);
    expect(formula({ ...baseline, systolicBpAtMost100: true })).toBe(1);
  });

  it("max score is 3", () => {
    expect(formula({
      alteredMentalStatus: true,
      respiratoryRateAtLeast22: true,
      systolicBpAtMost100: true,
    })).toBe(3);
  });
});

describe("qSOFA Sepsis-3 thresholds", () => {
  it("score 0 → low, routine assessment", () => {
    const r = interpret(0);
    expect(r.tier).toBe("low");
    expect(r.recommendation).toMatch(/routine/i);
  });

  it("score 1 → moderate, serial reassessment", () => {
    const r = interpret(1);
    expect(r.tier).toBe("moderate");
    expect(r.recommendation).toMatch(/reassess/i);
  });

  it("score ≥2 → high, suspect sepsis", () => {
    expect(interpret(2).tier).toBe("high");
    expect(interpret(3).tier).toBe("high");
    expect(interpret(2).recommendation).toMatch(/sepsis|organ dysfunction/i);
  });
});
