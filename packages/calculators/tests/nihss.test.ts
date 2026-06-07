import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/nihss";

const zero = {
  locResponsiveness: 0, locQuestions: 0, locCommands: 0, bestGaze: 0,
  visualFields: 0, facialPalsy: 0, motorArmLeft: 0, motorArmRight: 0,
  motorLegLeft: 0, motorLegRight: 0, limbAtaxia: 0, sensory: 0,
  bestLanguage: 0, dysarthria: 0, extinctionInattention: 0,
};

describe("NIHSS", () => {
  it("returns 0 for a neurologically normal exam", () => {
    expect(formula(zero)).toBe(0);
  });
  it("sums sub-scores", () => {
    expect(formula({ ...zero, motorArmLeft: 4, bestLanguage: 3, facialPalsy: 2 })).toBe(9);
  });
  it("returns 42 at maximum severity", () => {
    const max = {
      locResponsiveness: 3, locQuestions: 2, locCommands: 2, bestGaze: 2,
      visualFields: 3, facialPalsy: 3, motorArmLeft: 4, motorArmRight: 4,
      motorLegLeft: 4, motorLegRight: 4, limbAtaxia: 2, sensory: 2,
      bestLanguage: 3, dysarthria: 2, extinctionInattention: 2,
    };
    expect(formula(max)).toBe(42);
  });
  it("tiers per AHA/ASA severity bands", () => {
    expect(interpret(0).recommendationCode).toBe("NIHSS_NONE");
    expect(interpret(3).recommendationCode).toBe("NIHSS_MINOR");
    expect(interpret(10).recommendationCode).toBe("NIHSS_MODERATE");
    expect(interpret(18).recommendationCode).toBe("NIHSS_MODERATE_SEVERE");
    expect(interpret(25).recommendationCode).toBe("NIHSS_SEVERE");
  });
});
