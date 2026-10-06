import { describe, expect, it } from "vitest";
import { calculator, formula, interpret, type PlasmicInput } from "../src/plasmic";

const none: PlasmicInput = {
  plateletsLow: false,
  haemolysis: false,
  noActiveCancer: false,
  noTransplant: false,
  mcvLow: false,
  inrLow: false,
  creatinineLow: false,
};

describe("plasmic calculator", () => {
  it("adds one point per criterion met", () => {
    expect(formula(none)).toBe(0);
    for (const key of Object.keys(none) as (keyof PlasmicInput)[]) {
      expect(formula({ ...none, [key]: true })).toBe(1);
    }
    const all = Object.fromEntries(Object.keys(none).map((k) => [k, true])) as PlasmicInput;
    expect(formula(all)).toBe(7);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 7 });
  });

  it.each([
    [0, "low", "PLASMIC_LOW"],
    [4, "low", "PLASMIC_LOW"],
    [5, "moderate", "PLASMIC_INTERMEDIATE"],
    [6, "high", "PLASMIC_HIGH"],
    [7, "high", "PLASMIC_HIGH"],
  ])("classifies a score of %i as %s (%s)", (score, tier, code) => {
    expect(interpret(score).tier).toBe(tier);
    expect(interpret(score).recommendationCode).toBe(code);
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("plasmic");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("28259520");
  });
});
