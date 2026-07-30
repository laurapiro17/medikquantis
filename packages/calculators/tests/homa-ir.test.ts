import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/homa-ir";

describe("homa-ir calculator", () => {
  it("calculates HOMA-IR correctly for optimal sensitivity", () => {
    // Fasting Glucose 90 mg/dL, Insulin 4 µIU/mL -> (90 * 4)/405 = 0.89
    const inputs = { fastingGlucoseMgDl: 90, fastingInsulinuIUml: 4 };
    const score = formula(inputs);
    expect(score).toBe(0.89);

    const result = interpret(score);
    expect(result.tier).toBe("low");
    expect(result.recommendationCode).toBe("HOMA_OPTIMAL");
  });

  it("calculates HOMA-IR for elevated insulin resistance", () => {
    // Fasting Glucose 110 mg/dL, Insulin 15 µIU/mL -> (110 * 15)/405 = 4.07
    const inputs = { fastingGlucoseMgDl: 110, fastingInsulinuIUml: 15 };
    const score = formula(inputs);
    expect(score).toBe(4.07);

    const result = interpret(score);
    expect(result.tier).toBe("high");
    expect(result.recommendationCode).toBe("HOMA_ELEVATED");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("homa-ir");
    expect(calculator.specialty).toBe("endocrinology");
    expect(calculator.references.length).toBeGreaterThan(0);
  });
});
