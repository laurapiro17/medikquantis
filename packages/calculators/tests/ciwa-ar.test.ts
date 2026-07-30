import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/ciwa-ar";

describe("CIWA-Ar Calculator", () => {
  it("calculates mild alcohol withdrawal score", () => {
    const inputs = {
      nausea: "1",
      tremor: "1",
      sweats: "1",
      anxiety: "1",
      agitation: "0",
      tactile: "0",
      auditory: "0",
      visual: "0",
      headache: "1",
      orientation: "0",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(5);
    const result = interpret(score);
    expect(result.tier).toBe("low");
    expect(result.recommendationCode).toBe("CIWA_MILD");
  });

  it("calculates moderate alcohol withdrawal score", () => {
    const inputs = {
      nausea: "2",
      tremor: "3",
      sweats: "2",
      anxiety: "2",
      agitation: "1",
      tactile: "1",
      auditory: "0",
      visual: "0",
      headache: "2",
      orientation: "0",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(13);
    const result = interpret(score);
    expect(result.tier).toBe("moderate");
    expect(result.recommendationCode).toBe("CIWA_MODERATE");
  });

  it("calculates severe alcohol withdrawal score", () => {
    const inputs = {
      nausea: "5",
      tremor: "6",
      sweats: "5",
      anxiety: "5",
      agitation: "4",
      tactile: "3",
      auditory: "3",
      visual: "3",
      headache: "4",
      orientation: "2",
    } as const;
    const score = formula(inputs);
    expect(score).toBe(40);
    const result = interpret(score);
    expect(result.tier).toBe("high");
    expect(result.recommendationCode).toBe("CIWA_SEVERE");
  });

  it("validates metadata", () => {
    expect(calculator.id).toBe("ciwa-ar");
    expect(calculator.specialty).toBe("psychiatry");
  });
});
