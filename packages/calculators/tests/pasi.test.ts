import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/pasi";

const clear = {
  head: { area: 0, erythema: 0, induration: 0, desquamation: 0 },
  upperLimbs: { area: 0, erythema: 0, induration: 0, desquamation: 0 },
  trunk: { area: 0, erythema: 0, induration: 0, desquamation: 0 },
  lowerLimbs: { area: 0, erythema: 0, induration: 0, desquamation: 0 },
};

describe("PASI", () => {
  it("scores 0 with no involvement", () => {
    expect(formula(clear)).toBe(0);
  });

  it("scores 72 at full-body maximum severity", () => {
    const max = {
      head: { area: 6, erythema: 4, induration: 4, desquamation: 4 },
      upperLimbs: { area: 6, erythema: 4, induration: 4, desquamation: 4 },
      trunk: { area: 6, erythema: 4, induration: 4, desquamation: 4 },
      lowerLimbs: { area: 6, erythema: 4, induration: 4, desquamation: 4 },
    };
    expect(formula(max)).toBe(72);
  });

  it("weights regions correctly", () => {
    const onlyTrunk = {
      ...clear,
      trunk: { area: 6, erythema: 4, induration: 4, desquamation: 4 },
    };
    // (4+4+4) × 6 × 0.3 = 21.6
    expect(formula(onlyTrunk)).toBe(21.6);
  });

  it("tiers <5 mild, 5-9 moderate, ≥10 severe", () => {
    expect(interpret(3).recommendationCode).toBe("PASI_MILD");
    expect(interpret(7).recommendationCode).toBe("PASI_MODERATE");
    expect(interpret(15).recommendationCode).toBe("PASI_SEVERE");
  });
});
