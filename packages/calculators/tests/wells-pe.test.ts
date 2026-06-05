import { describe, it, expect } from "vitest";
import { formula, interpret, type WellsPeInput } from "../src/wells-pe";

const baseline: WellsPeInput = {
  clinicalSignsOfDvt: false,
  peAsLikelyAsAlternative: false,
  heartRateOver100: false,
  immobilizationOrSurgeryLast4Weeks: false,
  previousDvtOrPe: false,
  hemoptysis: false,
  activeOrTreatedMalignancy: false,
};

describe("Wells PE formula (weighted boolean sum)", () => {
  it("baseline returns 0", () => expect(formula(baseline)).toBe(0));

  it("clinical DVT signs contribute 3 points", () => {
    expect(formula({ ...baseline, clinicalSignsOfDvt: true })).toBe(3);
  });

  it("PE as likely as alternative contributes 3 points", () => {
    expect(formula({ ...baseline, peAsLikelyAsAlternative: true })).toBe(3);
  });

  it("each of HR>100, immobilization, prior DVT/PE contribute 1.5", () => {
    expect(formula({ ...baseline, heartRateOver100: true })).toBe(1.5);
    expect(formula({ ...baseline, immobilizationOrSurgeryLast4Weeks: true })).toBe(1.5);
    expect(formula({ ...baseline, previousDvtOrPe: true })).toBe(1.5);
  });

  it("each of hemoptysis, malignancy contribute 1", () => {
    expect(formula({ ...baseline, hemoptysis: true })).toBe(1);
    expect(formula({ ...baseline, activeOrTreatedMalignancy: true })).toBe(1);
  });

  it("max score with all criteria positive is 12.5", () => {
    const score = formula({
      clinicalSignsOfDvt: true,
      peAsLikelyAsAlternative: true,
      heartRateOver100: true,
      immobilizationOrSurgeryLast4Weeks: true,
      previousDvtOrPe: true,
      hemoptysis: true,
      activeOrTreatedMalignancy: true,
    });
    expect(score).toBe(12.5);
  });
});

describe("Wells PE two-tier interpretation (ESC 2019)", () => {
  it("score 0 → unlikely, d-dimer recommended", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(0).recommendation).toMatch(/d-dimer/i);
  });

  it("score 4.0 → still unlikely (boundary)", () => {
    expect(interpret(4).tier).toBe("low");
  });

  it("score 4.5 → likely, CTPA recommended", () => {
    expect(interpret(4.5).tier).toBe("high");
    expect(interpret(4.5).recommendation).toMatch(/CT pulmonary angiography|CTPA/i);
  });

  it("score 12.5 → likely (high tier)", () => {
    expect(interpret(12.5).tier).toBe("high");
  });
});
