import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/cockcroft-gault";

describe("Cockcroft-Gault Creatinine Clearance", () => {
  it("calculates male CrCl correctly", () => {
    // 60yo male, 70kg, Scr 1.0 -> ((140 - 60) * 70) / (72 * 1.0) = 5600 / 72 = 77.777... -> 77.8
    expect(
      formula({ age: 60, sex: "male", weight: 70, creatinine: 1.0 })
    ).toBe(77.8);
  });

  it("calculates female CrCl correctly with 0.85 multiplier", () => {
    // 60yo female, 70kg, Scr 1.0 -> 77.777... * 0.85 = 66.111... -> 66.1
    expect(
      formula({ age: 60, sex: "female", weight: 70, creatinine: 1.0 })
    ).toBe(66.1);
  });

  it("classifies mild impairment (60-89)", () => {
    const res = interpret(77.8);
    expect(res.tier).toBe("low");
    expect(res.recommendationCode).toBe("CG_MILD");
  });

  it("classifies severe impairment (15-29)", () => {
    const res = interpret(22.0);
    expect(res.tier).toBe("high");
    expect(res.recommendationCode).toBe("CG_SEVERE");
  });
});
