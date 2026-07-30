import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/sad-persons";

describe("SAD PERSONS Calculator", () => {
  it("calculates low risk score", () => {
    const inputs = {
      sex: "1",
      age: "0",
      depression: "1",
      previousAttempt: "0",
      ethanolUse: "0",
      rationalThinkingLoss: "0",
      socialSupportsLacking: "0",
      organizedPlan: "0",
      noSpouse: "0",
      sickness: "0",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(2);
    const result = interpret(score);
    expect(result.tier).toBe("low");
    expect(result.recommendationCode).toBe("SAD_PERSONS_LOW");
  });

  it("calculates high risk score", () => {
    const inputs = {
      sex: "1",
      age: "1",
      depression: "1",
      previousAttempt: "1",
      ethanolUse: "1",
      rationalThinkingLoss: "1",
      socialSupportsLacking: "0",
      organizedPlan: "0",
      noSpouse: "0",
      sickness: "0",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(6);
    const result = interpret(score);
    expect(result.tier).toBe("high");
    expect(result.recommendationCode).toBe("SAD_PERSONS_HIGH");
  });

  it("calculates very high risk score", () => {
    const inputs = {
      sex: "1",
      age: "1",
      depression: "1",
      previousAttempt: "1",
      ethanolUse: "1",
      rationalThinkingLoss: "1",
      socialSupportsLacking: "1",
      organizedPlan: "1",
      noSpouse: "1",
      sickness: "1",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(10);
    const result = interpret(score);
    expect(result.tier).toBe("high");
    expect(result.recommendationCode).toBe("SAD_PERSONS_VERY_HIGH");
  });

  it("validates metadata", () => {
    expect(calculator.id).toBe("sad-persons");
    expect(calculator.specialty).toBe("psychiatry");
  });
});
