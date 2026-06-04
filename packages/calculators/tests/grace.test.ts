import { describe, it, expect } from "vitest";
import { formula, interpret, GraceInputs, type GraceInput } from "../src/grace";

const baseline: GraceInput = {
  age: 25,
  heartRate: 45,
  systolicBP: 220,
  creatinine: 0.3,
  killipClass: "I",
  cardiacArrestAtAdmission: false,
  stSegmentDeviation: false,
  elevatedCardiacEnzymes: false,
};

describe("GRACE formula: continuous binners", () => {
  it("age binner has correct boundaries (every decade)", () => {
    // Granger 2003 table: <30=0, 30-39=8, 40-49=25, 50-59=41, 60-69=58, 70-79=75, 80-89=91, ≥90=100
    expect(formula({ ...baseline, age: 29 })).toBe(1); // pure baseline + creatinine 0.3 = 1
    expect(formula({ ...baseline, age: 30 })).toBe(9);
    expect(formula({ ...baseline, age: 39 })).toBe(9);
    expect(formula({ ...baseline, age: 40 })).toBe(26);
    expect(formula({ ...baseline, age: 49 })).toBe(26);
    expect(formula({ ...baseline, age: 50 })).toBe(42);
    expect(formula({ ...baseline, age: 89 })).toBe(92);
    expect(formula({ ...baseline, age: 90 })).toBe(101);
  });

  it("heart-rate binner: low HR = 0 points, high HR = many points", () => {
    expect(formula({ ...baseline, heartRate: 49 })).toBe(1);  // 0
    expect(formula({ ...baseline, heartRate: 50 })).toBe(4);  // 3
    expect(formula({ ...baseline, heartRate: 100 })).toBe(16); // 15
    expect(formula({ ...baseline, heartRate: 200 })).toBe(47); // 46
  });

  it("systolic BP binner: low SBP = high points (inverse)", () => {
    expect(formula({ ...baseline, systolicBP: 79 })).toBe(59);  // 58
    expect(formula({ ...baseline, systolicBP: 100 })).toBe(44); // 43
    expect(formula({ ...baseline, systolicBP: 140 })).toBe(25); // 24
    expect(formula({ ...baseline, systolicBP: 200 })).toBe(1);  // 0
  });

  it("creatinine binner across ranges", () => {
    expect(formula({ ...baseline, creatinine: 0.3 })).toBe(1);  // 1
    expect(formula({ ...baseline, creatinine: 1.0 })).toBe(7);  // 7
    expect(formula({ ...baseline, creatinine: 3.5 })).toBe(21); // 21
    expect(formula({ ...baseline, creatinine: 5.0 })).toBe(28); // 28
  });
});

describe("GRACE formula: categorical inputs", () => {
  it("Killip class adds 0/20/39/59", () => {
    expect(formula({ ...baseline, killipClass: "I" })).toBe(1);
    expect(formula({ ...baseline, killipClass: "II" })).toBe(21);
    expect(formula({ ...baseline, killipClass: "III" })).toBe(40);
    expect(formula({ ...baseline, killipClass: "IV" })).toBe(60);
  });

  it("cardiac arrest adds 39", () => {
    expect(formula({ ...baseline, cardiacArrestAtAdmission: true })).toBe(40);
  });

  it("ST deviation adds 28", () => {
    expect(formula({ ...baseline, stSegmentDeviation: true })).toBe(29);
  });

  it("elevated cardiac enzymes adds 14", () => {
    expect(formula({ ...baseline, elevatedCardiacEnzymes: true })).toBe(15);
  });
});

describe("GRACE realistic clinical cases", () => {
  it("typical NSTEMI 65yo with mild features: ~110 points", () => {
    const score = formula({
      age: 65, // 58
      heartRate: 85, // 9
      systolicBP: 130, // 34
      creatinine: 1.1, // 7
      killipClass: "I", // 0
      cardiacArrestAtAdmission: false,
      stSegmentDeviation: false,
      elevatedCardiacEnzymes: true, // 14
    });
    expect(score).toBe(122);
  });

  it("high-risk 78yo with Killip III: ~210 points", () => {
    const score = formula({
      age: 78, // 75
      heartRate: 105, // 15
      systolicBP: 95, // 53
      creatinine: 1.8, // 13
      killipClass: "III", // 39
      cardiacArrestAtAdmission: false,
      stSegmentDeviation: true, // 28
      elevatedCardiacEnzymes: true, // 14
    });
    expect(score).toBe(237);
  });
});

describe("GRACE input schema", () => {
  it("rejects out-of-range continuous values", () => {
    expect(GraceInputs.safeParse({ ...baseline, age: 17 }).success).toBe(false);
    expect(GraceInputs.safeParse({ ...baseline, heartRate: 5 }).success).toBe(false);
    expect(GraceInputs.safeParse({ ...baseline, systolicBP: 20 }).success).toBe(false);
    expect(GraceInputs.safeParse({ ...baseline, creatinine: 25 }).success).toBe(false);
  });

  it("accepts decimal creatinine", () => {
    expect(GraceInputs.safeParse({ ...baseline, creatinine: 1.4 }).success).toBe(true);
  });
});

describe("GRACE interpret() tiers (ESC NSTEMI)", () => {
  it("score ≤108 → low, selective invasive", () => {
    expect(interpret(60).tier).toBe("low");
    expect(interpret(108).tier).toBe("low");
    expect(interpret(108).recommendation).toMatch(/selective/i);
  });

  it("score 109-140 → moderate, early invasive (<24h)", () => {
    expect(interpret(109).tier).toBe("moderate");
    expect(interpret(140).tier).toBe("moderate");
    expect(interpret(130).recommendation).toMatch(/24h/i);
  });

  it("score >140 → high, urgent invasive (<2h)", () => {
    expect(interpret(141).tier).toBe("high");
    expect(interpret(220).tier).toBe("high");
    expect(interpret(180).recommendation).toMatch(/urgent/i);
  });

  it("attaches monotonically increasing in-hospital mortality", () => {
    expect(interpret(60).annualRiskPercent).toBeLessThan(interpret(120).annualRiskPercent!);
    expect(interpret(120).annualRiskPercent).toBeLessThan(interpret(180).annualRiskPercent!);
    expect(interpret(180).annualRiskPercent).toBeLessThan(interpret(240).annualRiskPercent!);
  });
});
