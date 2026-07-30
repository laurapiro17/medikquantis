import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/gad-7";

describe("GAD-7 Calculator", () => {
  it("calculates minimal anxiety score correctly", () => {
    const inputs = {
      q1: "0",
      q2: "1",
      q3: "0",
      q4: "0",
      q5: "0",
      q6: "1",
      q7: "0",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(2);
    const result = interpret(score);
    expect(result.tier).toBe("low");
    expect(result.recommendationCode).toBe("GAD7_MINIMAL");
  });

  it("calculates moderate anxiety score correctly", () => {
    const inputs = {
      q1: "2",
      q2: "2",
      q3: "2",
      q4: "1",
      q5: "2",
      q6: "1",
      q7: "2",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(12);
    const result = interpret(score);
    expect(result.tier).toBe("moderate");
    expect(result.recommendationCode).toBe("GAD7_MODERATE");
  });

  it("calculates severe anxiety score correctly", () => {
    const inputs = {
      q1: "3",
      q2: "3",
      q3: "3",
      q4: "2",
      q5: "3",
      q6: "2",
      q7: "3",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(19);
    const result = interpret(score);
    expect(result.tier).toBe("high");
    expect(result.recommendationCode).toBe("GAD7_SEVERE");
  });

  it("validates calculator metadata", () => {
    expect(calculator.id).toBe("gad-7");
    expect(calculator.specialty).toBe("psychiatry");
  });
});
