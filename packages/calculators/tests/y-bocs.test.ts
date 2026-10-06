import { describe, expect, it } from "vitest";
import { calculator, formula, interpret, YbocsInputs } from "../src/y-bocs";
import { getCalc } from "../src/registry";

describe("Y-BOCS", () => {
  it.each([
    [0, 0, 0],
    [20, 20, 40],
    [13, 7, 20],
    [0, 20, 20],
    [20, 0, 20],
  ])("sums obsessions %i and compulsions %i to %i", (obsessions, compulsions, expected) => {
    expect(formula({ obsessions, compulsions })).toBe(expected);
  });

  it.each([
    [0, "YBOCS_SUBCLINICAL", "low"],
    [7, "YBOCS_SUBCLINICAL", "low"],
    [8, "YBOCS_MILD", "low"],
    [15, "YBOCS_MILD", "low"],
    [16, "YBOCS_MODERATE", "moderate"],
    [23, "YBOCS_MODERATE", "moderate"],
    [24, "YBOCS_SEVERE", "high"],
    [31, "YBOCS_SEVERE", "high"],
    [32, "YBOCS_EXTREME", "high"],
    [40, "YBOCS_EXTREME", "high"],
  ])("classifies total %i as %s", (score, recommendationCode, tier) => {
    expect(interpret(score)).toMatchObject({ recommendationCode, tier });
  });

  it.each(["obsessions", "compulsions"] as const)("rejects invalid %s subtotals", (field) => {
    for (const invalid of [-1, 21, 1.5, NaN, Infinity, "10", null, undefined]) {
      const inputs = { obsessions: 0, compulsions: 0, [field]: invalid };
      expect(YbocsInputs.safeParse(inputs).success).toBe(false);
    }
  });

  it("registers the calculator for the catalogue and API", () => {
    expect(getCalc("y-bocs")).toBe(calculator);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 40 });
  });
});
