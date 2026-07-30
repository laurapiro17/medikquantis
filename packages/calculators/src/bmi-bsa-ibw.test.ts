import { describe, expect, it } from "vitest";
import { calculator, calculateDetails, formula, interpret } from "./bmi-bsa-ibw";

describe("bmi-bsa-ibw calculator", () => {
  it("calculates BMI correctly for standard male case", () => {
    const inputs = { heightCm: 175, weightKg: 70, sex: "male" as const };
    const score = formula(inputs);
    expect(score).toBe(22.9);
    const result = interpret(score, inputs);
    expect(result.category).toBe("normal");
    expect(result.tier).toBe("low");
  });

  it("calculates BSA, IBW, and ABW correctly", () => {
    const inputs = { heightCm: 177.8, weightKg: 80, sex: "male" as const }; // 70 inches height
    const details = calculateDetails(inputs);
    // Mosteller BSA = sqrt((177.8 * 80) / 3600) = sqrt(3.9511) = 1.99 m²
    expect(details.bsaMosteller).toBe(1.99);
    // Devine IBW male for 70 in = 50 + 2.3 * 10 = 73 kg
    expect(details.ibwDevine).toBe(73);
    // ABW = 73 + 0.4 * (80 - 73) = 75.8 kg
    expect(details.abw).toBe(75.8);
  });

  it("handles obesity class III", () => {
    const inputs = { heightCm: 160, weightKg: 110, sex: "female" as const };
    const score = formula(inputs); // 110 / (1.6 * 1.6) = 42.97 -> 43
    expect(score).toBe(43);
    const result = interpret(score, inputs);
    expect(result.category).toBe("obese_3");
    expect(result.tier).toBe("high");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("bmi-bsa-ibw");
    expect(calculator.specialty).toBe("endocrinology");
    expect(calculator.references.length).toBeGreaterThan(0);
  });
});
