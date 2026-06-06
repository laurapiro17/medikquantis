import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/harris-benedict";

describe("Harris-Benedict revised (Roza 1984)", () => {
  it("computes a typical male BMR", () => {
    // 30y/o male, 75 kg, 178 cm → ~1741 kcal/day (Roza coefficients)
    const bmr = formula({
      sex: "male",
      weightKg: 75,
      heightCm: 178,
      ageYears: 30,
      activityLevel: "moderate",
    });
    expect(bmr).toBeGreaterThan(1700);
    expect(bmr).toBeLessThan(1800);
  });

  it("computes a typical female BMR", () => {
    // 30y/o female, 60 kg, 165 cm → ~1395 kcal/day
    const bmr = formula({
      sex: "female",
      weightKg: 60,
      heightCm: 165,
      ageYears: 30,
      activityLevel: "sedentary",
    });
    expect(bmr).toBeGreaterThan(1350);
    expect(bmr).toBeLessThan(1450);
  });

  it("multiplies BMR by the chosen activity factor for TDEE", () => {
    const inputs = {
      sex: "female" as const,
      weightKg: 60,
      heightCm: 165,
      ageYears: 30,
      activityLevel: "moderate" as const,
    };
    const bmr = formula(inputs);
    const result = interpret(bmr, inputs);
    expect(result.bmrKcal).toBe(bmr);
    expect(result.activityFactor).toBe(1.55);
    expect(result.tdeeKcal).toBe(Math.round(bmr * 1.55));
  });

  it("uses sedentary factor 1.2 and very-active factor 1.9", () => {
    const base = {
      sex: "male" as const,
      weightKg: 70,
      heightCm: 175,
      ageYears: 40,
    };
    const bmr = formula({ ...base, activityLevel: "sedentary" });
    expect(interpret(bmr, { ...base, activityLevel: "sedentary" }).activityFactor).toBe(1.2);
    expect(interpret(bmr, { ...base, activityLevel: "very_active" }).activityFactor).toBe(1.9);
  });
});
