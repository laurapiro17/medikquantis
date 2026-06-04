import { describe, it, expect } from "vitest";
import { formula, interpret, HeartInputs, type HeartInput } from "../src/heart";

const baseline: HeartInput = {
  history: "slightly_suspicious",
  ecg: "normal",
  age: "lt_45",
  riskFactors: "none",
  troponin: "normal",
};

describe("HEART formula", () => {
  it("baseline (all minimum) returns 0", () => {
    expect(formula(baseline)).toBe(0);
  });

  it("each field's middle option contributes 1 point", () => {
    expect(formula({ ...baseline, history: "moderately_suspicious" })).toBe(1);
    expect(formula({ ...baseline, ecg: "non_specific_repolarization" })).toBe(1);
    expect(formula({ ...baseline, age: "45_to_64" })).toBe(1);
    expect(formula({ ...baseline, riskFactors: "1_or_2" })).toBe(1);
    expect(formula({ ...baseline, troponin: "1_to_3x_normal" })).toBe(1);
  });

  it("each field's highest option contributes 2 points", () => {
    expect(formula({ ...baseline, history: "highly_suspicious" })).toBe(2);
    expect(formula({ ...baseline, ecg: "significant_st_depression" })).toBe(2);
    expect(formula({ ...baseline, age: "gte_65" })).toBe(2);
    expect(formula({ ...baseline, riskFactors: "3_or_more_or_history" })).toBe(2);
    expect(formula({ ...baseline, troponin: "gt_3x_normal" })).toBe(2);
  });

  it("max score across all worst options is 10", () => {
    const max = formula({
      history: "highly_suspicious",
      ecg: "significant_st_depression",
      age: "gte_65",
      riskFactors: "3_or_more_or_history",
      troponin: "gt_3x_normal",
    });
    expect(max).toBe(10);
  });

  it("typical low-risk presentation: HEART 2", () => {
    const score = formula({
      ...baseline,
      history: "moderately_suspicious",
      age: "45_to_64",
    });
    expect(score).toBe(2);
  });

  it("typical intermediate-risk presentation: HEART 5", () => {
    const score = formula({
      history: "moderately_suspicious",
      ecg: "non_specific_repolarization",
      age: "45_to_64",
      riskFactors: "1_or_2",
      troponin: "1_to_3x_normal",
    });
    expect(score).toBe(5);
  });

  it("typical high-risk presentation: HEART 8", () => {
    const score = formula({
      history: "highly_suspicious",
      ecg: "significant_st_depression",
      age: "gte_65",
      riskFactors: "1_or_2",
      troponin: "1_to_3x_normal",
    });
    expect(score).toBe(8);
  });
});

describe("HEART input schema", () => {
  it("rejects unknown enum values", () => {
    const result = HeartInputs.safeParse({ ...baseline, history: "unknown" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid presentation", () => {
    expect(HeartInputs.safeParse(baseline).success).toBe(true);
  });
});

describe("HEART interpret() tiers", () => {
  it("score 0-3 → low (discharge with outpatient follow-up)", () => {
    expect(interpret(0).tier).toBe("low");
    expect(interpret(3).tier).toBe("low");
    expect(interpret(3).recommendation).toMatch(/discharge/i);
  });

  it("score 4-6 → moderate (admit for observation)", () => {
    expect(interpret(4).tier).toBe("moderate");
    expect(interpret(6).tier).toBe("moderate");
    expect(interpret(5).recommendation).toMatch(/admit/i);
  });

  it("score 7-10 → high (early invasive strategy)", () => {
    expect(interpret(7).tier).toBe("high");
    expect(interpret(10).tier).toBe("high");
    expect(interpret(9).recommendation).toMatch(/invasive/i);
  });

  it("attaches 6-week MACE rate per Backus 2013 validation", () => {
    expect(interpret(0).annualRiskPercent).toBe(0.9);
    expect(interpret(3).annualRiskPercent).toBe(2.5);
    expect(interpret(6).annualRiskPercent).toBe(22.7);
    expect(interpret(10).annualRiskPercent).toBe(65.2);
  });
});
