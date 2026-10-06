import { describe, expect, it } from "vitest";
import { calculator, formula, interpret, type IpiInput } from "../src/ipi";

const none: IpiInput = {
  ageOver60: false,
  ldhHigh: false,
  ecog2OrMore: false,
  advancedStage: false,
  extranodalOver1: false,
};

describe("ipi calculator", () => {
  it("adds one point per adverse factor", () => {
    expect(formula(none)).toBe(0);
    for (const key of Object.keys(none) as (keyof IpiInput)[]) {
      expect(formula({ ...none, [key]: true })).toBe(1);
    }
    expect(formula({
      ageOver60: true,
      ldhHigh: true,
      ecog2OrMore: true,
      advancedStage: true,
      extranodalOver1: true,
    })).toBe(5);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 5 });
  });

  it.each([
    [0, "low", "IPI_LOW"],
    [1, "low", "IPI_LOW"],
    [2, "moderate", "IPI_LOW_INTERMEDIATE"],
    [3, "moderate", "IPI_HIGH_INTERMEDIATE"],
    [4, "high", "IPI_HIGH"],
    [5, "high", "IPI_HIGH"],
  ])("classifies a score of %i as %s (%s)", (score, tier, code) => {
    expect(interpret(score).tier).toBe(tier);
    expect(interpret(score).recommendationCode).toBe(code);
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("ipi");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("8141877");
  });
});
