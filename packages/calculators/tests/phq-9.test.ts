import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/phq-9";

describe("PHQ-9 Calculator", () => {
  it("calculates minimal score correctly", () => {
    const inputs = {
      q1: "0",
      q2: "0",
      q3: "0",
      q4: "0",
      q5: "0",
      q6: "0",
      q7: "0",
      q8: "0",
      q9: "0",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(0);
    const result = interpret(score);
    expect(result.tier).toBe("low");
    expect(result.recommendationCode).toBe("PHQ9_MINIMAL");
  });

  it("calculates moderate depression score correctly", () => {
    const inputs = {
      q1: "2",
      q2: "2",
      q3: "1",
      q4: "2",
      q5: "1",
      q6: "1",
      q7: "1",
      q8: "1",
      q9: "1",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(12);
    const result = interpret(score);
    expect(result.tier).toBe("moderate");
    expect(result.recommendationCode).toBe("PHQ9_MODERATE");
  });

  it("calculates severe depression score correctly", () => {
    const inputs = {
      q1: "3",
      q2: "3",
      q3: "3",
      q4: "3",
      q5: "3",
      q6: "2",
      q7: "3",
      q8: "2",
      q9: "3",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(25);
    const result = interpret(score);
    expect(result.tier).toBe("high");
    expect(result.recommendationCode).toBe("PHQ9_SEVERE");
  });

  it("validates calculator metadata", () => {
    expect(calculator.id).toBe("phq-9");
    expect(calculator.specialty).toBe("psychiatry");
  });
});
