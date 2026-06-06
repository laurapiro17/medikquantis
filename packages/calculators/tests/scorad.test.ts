import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/scorad";

describe("SCORAD", () => {
  it("scores 0 with no involvement", () => {
    expect(
      formula({
        extentPercent: 0,
        erythema: 0,
        edemaPapules: 0,
        exudateCrusts: 0,
        excoriations: 0,
        lichenification: 0,
        dryness: 0,
        pruritus: 0,
        sleepLoss: 0,
      }),
    ).toBe(0);
  });

  it("applies the SCORAD formula A/5 + 7B/2 + C", () => {
    // A=50/5=10, B=18·7/2=63, C=20 → 93
    expect(
      formula({
        extentPercent: 50,
        erythema: 3,
        edemaPapules: 3,
        exudateCrusts: 3,
        excoriations: 3,
        lichenification: 3,
        dryness: 3,
        pruritus: 10,
        sleepLoss: 10,
      }),
    ).toBe(93);
  });

  it("tiers <25 mild, 25-50 moderate, >50 severe", () => {
    expect(interpret(15).recommendationCode).toBe("SCORAD_MILD");
    expect(interpret(40).recommendationCode).toBe("SCORAD_MODERATE");
    expect(interpret(60).recommendationCode).toBe("SCORAD_SEVERE");
  });
});
