import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/rcri";

const empty = {
  highRiskSurgery: false,
  ischemicHeartDisease: false,
  congestiveHeartFailure: false,
  cerebrovascularDisease: false,
  preoperativeInsulin: false,
  creatinineOver2: false,
};

describe("RCRI (Lee 1999)", () => {
  it("scores 0 for the baseline patient", () => {
    expect(formula(empty)).toBe(0);
  });

  it("adds 1 per positive criterion", () => {
    expect(
      formula({
        ...empty,
        highRiskSurgery: true,
        ischemicHeartDisease: true,
      }),
    ).toBe(2);
  });

  it("scores 6 with all positive", () => {
    expect(
      formula({
        highRiskSurgery: true,
        ischemicHeartDisease: true,
        congestiveHeartFailure: true,
        cerebrovascularDisease: true,
        preoperativeInsulin: true,
        creatinineOver2: true,
      }),
    ).toBe(6);
  });

  it("tiers per Lee 1999 (0 very low, 1 low, 2 intermediate, ≥3 high)", () => {
    expect(interpret(0).recommendationCode).toBe("RCRI_VERY_LOW");
    expect(interpret(1).recommendationCode).toBe("RCRI_LOW");
    expect(interpret(2).tier).toBe("moderate");
    expect(interpret(3).tier).toBe("high");
  });

  it("reports event rate increasing with score", () => {
    expect(interpret(0).annualRiskPercent).toBeLessThan(
      interpret(3).annualRiskPercent ?? 0,
    );
  });
});
