import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/apache2";

const zero = {
  temperature: 0, meanArterialPressure: 0, heartRate: 0, respiratoryRate: 0,
  oxygenation: 0, arterialPh: 0, sodium: 0, potassium: 0, creatinine: 0,
  hematocrit: 0, whiteCellCount: 0, glasgowComaScore: 0,
  agePoints: 0, chronicHealthPoints: 0,
};

describe("APACHE II", () => {
  it("sums APS + age + chronic health", () => {
    expect(formula({ ...zero, temperature: 2, glasgowComaScore: 3, agePoints: 5 })).toBe(10);
  });
  it("tiers per Knaus 1985 mortality bands", () => {
    expect(interpret(3).recommendationCode).toBe("APACHE2_LOW");
    expect(interpret(12).recommendationCode).toBe("APACHE2_MODERATE");
    expect(interpret(22).recommendationCode).toBe("APACHE2_HIGH");
    expect(interpret(32).recommendationCode).toBe("APACHE2_VERY_HIGH");
  });
});
