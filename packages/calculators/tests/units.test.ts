import { describe, expect, it } from "vitest";
import {
  albuminGDlToGL,
  albuminGLToGDl,
  bilirubinMgDlToUmolL,
  bilirubinUmolLToMgDl,
  bunMgDlToUreaMmolL,
  calciumMgDlToMmolL,
  calciumMmolLToMgDl,
  cmToInches,
  creatinineMgDlToUmolL,
  creatinineUmolLToMgDl,
  glucoseMgDlToMmolL,
  glucoseMmolLToMgDl,
  inchesToCm,
  kgToLbs,
  lbsToKg,
  ureaMmolLToBunMgDl,
} from "../src/units";

describe("units conversion utilities", () => {
  it("converts glucose correctly", () => {
    expect(glucoseMgDlToMmolL(90)).toBe(5);
    expect(glucoseMmolLToMgDl(5)).toBe(90.1);
  });

  it("converts creatinine correctly", () => {
    expect(creatinineMgDlToUmolL(1.0)).toBe(88.4);
    expect(creatinineUmolLToMgDl(88.4)).toBe(1);
  });

  it("converts calcium correctly", () => {
    expect(calciumMgDlToMmolL(10)).toBe(2.5);
    expect(calciumMmolLToMgDl(2.5)).toBe(10);
  });

  it("converts bilirubin correctly", () => {
    expect(bilirubinMgDlToUmolL(1.0)).toBe(17.1);
    expect(bilirubinUmolLToMgDl(17.1)).toBe(1);
  });

  it("converts albumin correctly", () => {
    expect(albuminGDlToGL(4.0)).toBe(40);
    expect(albuminGLToGDl(40)).toBe(4.0);
  });

  it("converts bun and urea correctly", () => {
    expect(bunMgDlToUreaMmolL(28)).toBe(10);
    expect(ureaMmolLToBunMgDl(10)).toBe(28);
  });

  it("converts weight and height correctly", () => {
    expect(lbsToKg(154)).toBe(69.9);
    expect(kgToLbs(70)).toBe(154.3);
    expect(inchesToCm(70)).toBe(177.8);
    expect(cmToInches(177.8)).toBe(70);
  });
});
