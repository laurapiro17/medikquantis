import { describe, it, expect } from "vitest";
import { formula, interpret, TimiInputs, type TimiInput } from "../src/timi";

const baseline: TimiInput = {
  ageOver65: false,
  threeOrMoreCadRiskFactors: false,
  knownCoronaryStenosis: false,
  aspirinInLast7Days: false,
  severeAnginaInLast24h: false,
  elevatedCardiacMarkers: false,
  stDeviationAtLeastHalfMm: false,
};

describe("TIMI formula", () => {
  it("baseline (no criteria) returns 0", () => {
    expect(formula(baseline)).toBe(0);
  });

  it("each criterion contributes exactly 1 point", () => {
    expect(formula({ ...baseline, ageOver65: true })).toBe(1);
    expect(formula({ ...baseline, threeOrMoreCadRiskFactors: true })).toBe(1);
    expect(formula({ ...baseline, knownCoronaryStenosis: true })).toBe(1);
    expect(formula({ ...baseline, aspirinInLast7Days: true })).toBe(1);
    expect(formula({ ...baseline, severeAnginaInLast24h: true })).toBe(1);
    expect(formula({ ...baseline, elevatedCardiacMarkers: true })).toBe(1);
    expect(formula({ ...baseline, stDeviationAtLeastHalfMm: true })).toBe(1);
  });

  it("max score is 7 with every criterion present", () => {
    const score = formula({
      ageOver65: true,
      threeOrMoreCadRiskFactors: true,
      knownCoronaryStenosis: true,
      aspirinInLast7Days: true,
      severeAnginaInLast24h: true,
      elevatedCardiacMarkers: true,
      stDeviationAtLeastHalfMm: true,
    });
    expect(score).toBe(7);
  });

  it("typical NSTEMI 68yo with smoking + HTN + DM + elevated trop: 3", () => {
    const score = formula({
      ...baseline,
      ageOver65: true,
      threeOrMoreCadRiskFactors: true,
      elevatedCardiacMarkers: true,
    });
    expect(score).toBe(3);
  });

  it("high-risk case: 75yo, known CAD, on ASA, severe angina, trop+, ST↓: 6", () => {
    const score = formula({
      ageOver65: true,
      threeOrMoreCadRiskFactors: false,
      knownCoronaryStenosis: true,
      aspirinInLast7Days: true,
      severeAnginaInLast24h: true,
      elevatedCardiacMarkers: true,
      stDeviationAtLeastHalfMm: true,
    });
    expect(score).toBe(6);
  });
});

describe("TIMI input schema", () => {
  it("accepts a fully-specified valid input", () => {
    expect(TimiInputs.safeParse(baseline).success).toBe(true);
  });

  it("rejects non-boolean values", () => {
    expect(TimiInputs.safeParse({ ...baseline, ageOver65: "yes" }).success).toBe(false);
  });

  it("rejects missing fields", () => {
    const { ageOver65, ...rest } = baseline;
    expect(TimiInputs.safeParse(rest).success).toBe(false);
  });
});

describe("TIMI interpret() tiers (ESC NSTEMI alignment)", () => {
  it("score 0-2 → low, conservative reasonable", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(2).tier).toBe("low");
    expect(interpret(1).recommendation).toMatch(/conservative/i);
  });

  it("score 3-4 → moderate, consider early invasive", () => {
    expect(interpret(3).tier).toBe("moderate");
    expect(interpret(4).tier).toBe("moderate");
    expect(interpret(3).recommendation).toMatch(/invasive/i);
  });

  it("score 5-7 → high, urgent invasive", () => {
    expect(interpret(5).tier).toBe("high");
    expect(interpret(7).tier).toBe("high");
    expect(interpret(6).recommendation).toMatch(/urgent/i);
  });

  it("attaches 14-day MACE % per Antman 2000 table", () => {
    expect(interpret(0).annualRiskPercent).toBe(4.7);
    expect(interpret(2).annualRiskPercent).toBe(8.3);
    expect(interpret(4).annualRiskPercent).toBe(19.9);
    expect(interpret(6).annualRiskPercent).toBe(40.9);
  });
});
