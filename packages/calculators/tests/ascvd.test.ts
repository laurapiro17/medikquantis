import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/ascvd";

describe("ASCVD Pooled Cohort Equations", () => {
  it("computes a reasonable risk for a 55-year-old white woman", () => {
    const r = formula({
      sex: "female", race: "white_or_other", age: 55,
      totalCholesterolMgDl: 200, hdlMgDl: 55,
      systolicBpMmHg: 130, treatedForHypertension: false,
      diabetes: false, smoker: false,
    });
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThan(20);
  });

  it("higher risk with smoking, diabetes, and higher SBP", () => {
    const base = {
      sex: "male" as const, race: "white_or_other" as const, age: 60,
      totalCholesterolMgDl: 200, hdlMgDl: 50,
      systolicBpMmHg: 120, treatedForHypertension: false,
    };
    const low = formula({ ...base, diabetes: false, smoker: false });
    const high = formula({
      ...base,
      systolicBpMmHg: 160,
      diabetes: true,
      smoker: true,
    });
    expect(high).toBeGreaterThan(low);
  });

  it("tiers per 2018 AHA/ACC cholesterol guideline", () => {
    expect(interpret(3).recommendationCode).toBe("ASCVD_LOW");
    expect(interpret(6).recommendationCode).toBe("ASCVD_BORDERLINE");
    expect(interpret(12).recommendationCode).toBe("ASCVD_INTERMEDIATE");
    expect(interpret(25).recommendationCode).toBe("ASCVD_HIGH");
  });
});
