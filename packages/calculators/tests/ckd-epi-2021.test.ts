import { describe, it, expect } from "vitest";
import { formula, interpret, type CkdEpi2021Input } from "../src/ckd-epi-2021";

describe("CKD-EPI 2021 formula", () => {
  // Reference values from the original Inker 2021 nomogram (Table 1):
  // 60 yo male, Scr 1.0 → eGFR ≈ 87 mL/min/1.73 m²
  // 60 yo female, Scr 1.0 → eGFR ≈ 65 mL/min/1.73 m²
  // 40 yo male, Scr 0.8 → eGFR ≈ 113 mL/min/1.73 m²
  // 75 yo female, Scr 1.5 → eGFR ≈ 36 mL/min/1.73 m²

  it("60yo male, Scr 1.0 ≈ 87", () => {
    const egfr = formula({ age: 60, sex: "male", creatinine: 1.0 });
    expect(egfr).toBeGreaterThan(85);
    expect(egfr).toBeLessThan(90);
  });

  it("60yo female, Scr 1.0 ≈ 65", () => {
    const egfr = formula({ age: 60, sex: "female", creatinine: 1.0 });
    expect(egfr).toBeGreaterThan(63);
    expect(egfr).toBeLessThan(67);
  });

  it("75yo female, Scr 1.5 ≈ 36 → CKD G3b", () => {
    const inputs: CkdEpi2021Input = { age: 75, sex: "female", creatinine: 1.5 };
    const egfr = formula(inputs);
    expect(egfr).toBeGreaterThan(34);
    expect(egfr).toBeLessThan(40);
    expect(interpret(egfr).tier).toBe("moderate");
  });

  it("very high creatinine in 80yo → severe CKD (G4 or G5)", () => {
    const egfr = formula({ age: 80, sex: "male", creatinine: 4.0 });
    expect(egfr).toBeLessThan(20);
    expect(interpret(egfr).tier).toBe("high");
  });
});

describe("CKD-EPI 2021 stage mapping", () => {
  it("eGFR ≥90 → G1, low tier", () => {
    const r = interpret(95);
    expect(r.stage).toBe("G1");
    expect(r.tier).toBe("low");
  });

  it("eGFR 60-89 → G2, low tier", () => {
    expect(interpret(75).stage).toBe("G2");
    expect(interpret(60).stage).toBe("G2");
  });

  it("eGFR 45-59 → G3a, moderate", () => {
    expect(interpret(50).stage).toBe("G3a");
    expect(interpret(45).stage).toBe("G3a");
    expect(interpret(50).tier).toBe("moderate");
  });

  it("eGFR 30-44 → G3b, moderate", () => {
    expect(interpret(35).stage).toBe("G3b");
    expect(interpret(30).stage).toBe("G3b");
  });

  it("eGFR 15-29 → G4, high tier", () => {
    expect(interpret(20).stage).toBe("G4");
    expect(interpret(15).stage).toBe("G4");
    expect(interpret(20).tier).toBe("high");
  });

  it("eGFR <15 → G5 (kidney failure)", () => {
    expect(interpret(10).stage).toBe("G5");
    expect(interpret(5).stage).toBe("G5");
    expect(interpret(5).recommendation).toMatch(/dialysis|transplant/i);
  });
});
