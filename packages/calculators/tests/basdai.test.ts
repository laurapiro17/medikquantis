import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/basdai";

describe("BASDAI", () => {
  it("averages morning stiffness items before combining", () => {
    // All zero → score 0
    expect(
      formula({
        fatigue: 0,
        spineNeckHipPain: 0,
        jointPainSwelling: 0,
        tendernessOnTouch: 0,
        morningStiffnessSeverity: 0,
        morningStiffnessDuration: 0,
      }),
    ).toBe(0);

    // All 10 → score 10
    expect(
      formula({
        fatigue: 10,
        spineNeckHipPain: 10,
        jointPainSwelling: 10,
        tendernessOnTouch: 10,
        morningStiffnessSeverity: 10,
        morningStiffnessDuration: 10,
      }),
    ).toBe(10);
  });

  it("combines morning items as average then divides total by 5", () => {
    // 1+2+3+4 + mean(5, 7)=6 → 16, / 5 → 3.2
    expect(
      formula({
        fatigue: 1,
        spineNeckHipPain: 2,
        jointPainSwelling: 3,
        tendernessOnTouch: 4,
        morningStiffnessSeverity: 5,
        morningStiffnessDuration: 7,
      }),
    ).toBe(3.2);
  });

  it("places <4 low, 4–7 active, ≥7 very high", () => {
    expect(interpret(3.5).recommendationCode).toBe("BASDAI_LOW");
    expect(interpret(5).recommendationCode).toBe("BASDAI_ACTIVE");
    expect(interpret(7).recommendationCode).toBe("BASDAI_VERY_HIGH");
  });
});
