import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/hinchey";

describe("Hinchey classification", () => {
  it("maps each class to its ordinal", () => {
    expect(formula({ hincheyClass: "I" })).toBe(1);
    expect(formula({ hincheyClass: "II" })).toBe(2);
    expect(formula({ hincheyClass: "III" })).toBe(3);
    expect(formula({ hincheyClass: "IV" })).toBe(4);
  });

  it("tiers I low, II moderate, III/IV high", () => {
    expect(interpret(1, { hincheyClass: "I" }).tier).toBe("low");
    expect(interpret(2, { hincheyClass: "II" }).tier).toBe("moderate");
    expect(interpret(3, { hincheyClass: "III" }).tier).toBe("high");
    expect(interpret(4, { hincheyClass: "IV" }).tier).toBe("high");
  });

  it("recommends faecal-peritonitis surgery on class IV", () => {
    expect(interpret(4, { hincheyClass: "IV" }).recommendationCode).toBe(
      "HINCHEY_IV",
    );
  });
});
