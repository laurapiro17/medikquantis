import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/bmi";

describe("BMI Calculator", () => {
  it("calculates BMI accurately", () => {
    // 180 cm (1.8m), 75 kg -> 75 / (1.8 * 1.8) = 75 / 3.24 = 23.148... -> 23.1
    expect(formula({ height: 180, weight: 75 })).toBe(23.1);
  });

  it("classifies normal weight", () => {
    const res = interpret(23.1);
    expect(res.tier).toBe("low");
    expect(res.recommendationCode).toBe("BMI_NORMAL");
  });

  it("classifies overweight", () => {
    const res = interpret(27.5);
    expect(res.tier).toBe("moderate");
    expect(res.recommendationCode).toBe("BMI_OVERWEIGHT");
  });

  it("classifies Class III obesity", () => {
    const res = interpret(42.0);
    expect(res.tier).toBe("high");
    expect(res.recommendationCode).toBe("BMI_OBESITY_3");
  });
});
