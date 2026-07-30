import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/cows";

describe("COWS Calculator", () => {
  it("calculates mild opioid withdrawal score", () => {
    const inputs = {
      hr: "1",
      sweat: "1",
      restless: "1",
      pupils: "1",
      aches: "1",
      rhinorrhea: "1",
      gi: "1",
      tremor: "1",
      yawn: "1",
      anxiety: "1",
      gooseflesh: "0",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(10);
    const result = interpret(score);
    expect(result.tier).toBe("low");
    expect(result.recommendationCode).toBe("COWS_MILD");
  });

  it("calculates moderate opioid withdrawal score", () => {
    const inputs = {
      hr: "2",
      sweat: "2",
      restless: "3",
      pupils: "2",
      aches: "2",
      rhinorrhea: "2",
      gi: "2",
      tremor: "2",
      yawn: "2",
      anxiety: "2",
      gooseflesh: "0",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(21);
    const result = interpret(score);
    expect(result.tier).toBe("moderate");
    expect(result.recommendationCode).toBe("COWS_MODERATE");
  });

  it("calculates severe opioid withdrawal score", () => {
    const inputs = {
      hr: "4",
      sweat: "4",
      restless: "5",
      pupils: "5",
      aches: "4",
      rhinorrhea: "4",
      gi: "5",
      tremor: "4",
      yawn: "4",
      anxiety: "4",
      gooseflesh: "5",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(48);
    const result = interpret(score);
    expect(result.tier).toBe("high");
    expect(result.recommendationCode).toBe("COWS_SEVERE");
  });

  it("validates metadata", () => {
    expect(calculator.id).toBe("cows");
    expect(calculator.specialty).toBe("psychiatry");
  });
});
