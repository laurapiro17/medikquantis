import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/sofa";

describe("SOFA", () => {
  it("sums the 6 organ subscores", () => {
    expect(formula({ respiration: 2, coagulation: 1, liver: 0, cardiovascular: 3, cns: 1, renal: 0 })).toBe(7);
  });
  it("returns 24 at all max", () => {
    expect(formula({ respiration: 4, coagulation: 4, liver: 4, cardiovascular: 4, cns: 4, renal: 4 })).toBe(24);
  });
  it("tiers per Vincent 1998 mortality bands", () => {
    expect(interpret(5).recommendationCode).toBe("SOFA_LOW");
    expect(interpret(8).recommendationCode).toBe("SOFA_MODERATE");
    expect(interpret(11).recommendationCode).toBe("SOFA_SEVERE");
    expect(interpret(15).recommendationCode).toBe("SOFA_VERY_HIGH");
  });
});
