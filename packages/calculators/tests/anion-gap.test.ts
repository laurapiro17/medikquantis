import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/anion-gap";

describe("Anion gap", () => {
  it("computes Na − (Cl + HCO3)", () => {
    // 140 − (105 + 24) = 11
    expect(
      formula({
        sodiumMEqL: 140,
        chlorideMEqL: 105,
        bicarbonateMEqL: 24,
      }),
    ).toBe(11);
  });

  it("applies Figge albumin correction when supplied", () => {
    // base AG = 8, albumin 2.0 → correction +2.5·(4−2) = +5 → corrected 13
    expect(
      formula({
        sodiumMEqL: 140,
        chlorideMEqL: 108,
        bicarbonateMEqL: 24,
        albuminGDl: 2.0,
      }),
    ).toBe(13);
  });

  it("classifies < 6 low, 6–12 normal, > 12 elevated", () => {
    expect(interpret(4).category).toBe("low");
    expect(interpret(10).category).toBe("normal");
    expect(interpret(18).category).toBe("elevated");
  });
});
