import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/wells-dvt";

const empty = {
  activeCancer: false, bedridden3DaysOrSurgery12Weeks: false,
  paralysisOrPlasterImmobilisation: false, localisedTendernessAlongVeins: false,
  entireLegSwollen: false, calfSwellingOver3cm: false,
  pittingOedemaSymptomaticLeg: false, collateralSuperficialVeins: false,
  previouslyDocumentedDvt: false, alternativeDiagnosisAtLeastAsLikely: false,
};

describe("Wells DVT", () => {
  it("sums positive criteria", () => {
    expect(formula({ ...empty, activeCancer: true, entireLegSwollen: true })).toBe(2);
  });
  it("subtracts 2 when an alternative diagnosis is at least as likely", () => {
    expect(formula({ ...empty, alternativeDiagnosisAtLeastAsLikely: true })).toBe(-2);
  });
  it("two-tier: <2 unlikely (D-dimer), ≥2 likely (ultrasound)", () => {
    expect(interpret(1).recommendationCode).toBe("WELLSDVT_UNLIKELY");
    expect(interpret(2).recommendationCode).toBe("WELLSDVT_LIKELY");
  });
});
