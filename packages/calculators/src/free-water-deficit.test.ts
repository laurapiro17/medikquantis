import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "./free-water-deficit";

describe("free-water-deficit calculator", () => {
  it("calculates water deficit correctly for adult male hypernatremia", () => {
    // 70 kg adult male, Na 160 mEq/L, target 140
    // TBW = 70 * 0.6 = 42 L
    // Deficit = 42 * (160/140 - 1) = 42 * (0.142857) = 6 L
    const inputs = {
      weightKg: 70,
      currentSodiumMEqL: 160,
      targetSodiumMEqL: 140,
      sex: "male" as const,
      ageCategory: "adult" as const,
    };
    const score = formula(inputs);
    expect(score).toBe(6);

    const result = interpret(score, inputs);
    expect(result.tier).toBe("high");
    expect(result.tbwLiters).toBe(42);
    expect(result.recommendationCode).toBe("FWD_DEFICIT_CALCULATED");
  });

  it("handles elderly female case", () => {
    // 60 kg elderly female, Na 150 mEq/L, target 140
    // TBW = 60 * 0.45 = 27 L
    // Deficit = 27 * (150/140 - 1) = 27 * 0.071428 = 1.9 L
    const inputs = {
      weightKg: 60,
      currentSodiumMEqL: 150,
      targetSodiumMEqL: 140,
      sex: "female" as const,
      ageCategory: "elderly" as const,
    };
    const score = formula(inputs);
    expect(score).toBe(1.9);

    const result = interpret(score, inputs);
    expect(result.tier).toBe("moderate");
    expect(result.tbwLiters).toBe(27);
  });

  it("matches calculator definition metadata", () => {
    expect(calculator.id).toBe("free-water-deficit");
    expect(calculator.specialty).toBe("nephrology");
    expect(calculator.references.length).toBeGreaterThan(0);
  });
});
