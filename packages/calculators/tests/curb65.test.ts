import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/curb65";

describe("CURB-65", () => {
  it("sums one point per positive criterion", () => {
    expect(
      formula({
        confusion: false,
        ureaOver7: false,
        respiratoryRateAtLeast30: false,
        lowBloodPressure: false,
        ageAtLeast65: false,
      }),
    ).toBe(0);
    expect(
      formula({
        confusion: true,
        ureaOver7: true,
        respiratoryRateAtLeast30: true,
        lowBloodPressure: true,
        ageAtLeast65: true,
      }),
    ).toBe(5);
  });

  it("places 0-1 in low (outpatient)", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(1).tier).toBe("low");
    expect(interpret(1).recommendationCode).toBe("CURB65_LOW_OUTPATIENT");
  });

  it("places 2 in moderate (ward)", () => {
    expect(interpret(2).tier).toBe("moderate");
    expect(interpret(2).recommendationCode).toBe("CURB65_INTERMEDIATE_WARD");
  });

  it("places 3-5 in high (ICU)", () => {
    for (const s of [3, 4, 5]) {
      expect(interpret(s).tier).toBe("high");
      expect(interpret(s).recommendationCode).toBe("CURB65_SEVERE_ICU");
    }
  });

  it("returns Lim 2003 mortality estimates", () => {
    expect(interpret(0).annualRiskPercent).toBe(0.7);
    expect(interpret(5).annualRiskPercent).toBe(57);
  });
});
