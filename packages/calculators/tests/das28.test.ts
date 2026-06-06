import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/das28";

describe("DAS28", () => {
  it("computes a low score for inactive disease (ESR)", () => {
    const score = formula({
      markerType: "ESR",
      markerValue: 5,
      tenderJointCount28: 0,
      swollenJointCount28: 0,
      patientGlobalAssessment: 5,
    });
    expect(score).toBeLessThan(2.6);
  });

  it("computes a higher score for active disease (ESR)", () => {
    const score = formula({
      markerType: "ESR",
      markerValue: 50,
      tenderJointCount28: 10,
      swollenJointCount28: 6,
      patientGlobalAssessment: 60,
    });
    expect(score).toBeGreaterThan(5.1);
  });

  it("CRP variant runs lower than ESR for identical inputs", () => {
    const base = {
      tenderJointCount28: 8,
      swollenJointCount28: 5,
      patientGlobalAssessment: 50,
    };
    const esr = formula({ ...base, markerType: "ESR", markerValue: 30 });
    const crp = formula({ ...base, markerType: "CRP", markerValue: 30 });
    expect(crp).toBeLessThanOrEqual(esr);
  });

  it("classifies tiers per EULAR thresholds", () => {
    expect(interpret(2).category).toBe("remission");
    expect(interpret(3).category).toBe("low");
    expect(interpret(4).category).toBe("moderate");
    expect(interpret(6).category).toBe("high");
  });

  it("clamps ESR at 1 for the log to avoid -Infinity", () => {
    const score = formula({
      markerType: "ESR",
      markerValue: 0,
      tenderJointCount28: 0,
      swollenJointCount28: 0,
      patientGlobalAssessment: 0,
    });
    expect(Number.isFinite(score)).toBe(true);
  });
});
