import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/glasgow-blatchford";

const safe = {
  sex: "male" as const,
  bunMgDl: 15,
  hemoglobinGDl: 14,
  systolicBpMmHg: 130,
  heartRateOver100: false,
  melaena: false,
  syncope: false,
  hepaticDisease: false,
  cardiacFailure: false,
};

describe("Glasgow-Blatchford", () => {
  it("scores 0 for the haemodynamically stable patient with normal labs", () => {
    expect(formula(safe)).toBe(0);
  });
  it("bumps with severe anaemia and uraemia", () => {
    const high = { ...safe, hemoglobinGDl: 8, bunMgDl: 75 };
    expect(formula(high)).toBeGreaterThanOrEqual(12);
  });
  it("tiers 0 safe-discharge, 1-5 low-mod, ≥6 high", () => {
    expect(interpret(0).recommendationCode).toBe("GBS_SAFE_DISCHARGE");
    expect(interpret(3).recommendationCode).toBe("GBS_LOW_MOD");
    expect(interpret(8).recommendationCode).toBe("GBS_HIGH");
  });
  it("counts +1 for tachycardia, +1 melaena, +2 syncope", () => {
    expect(formula({ ...safe, heartRateOver100: true })).toBe(1);
    expect(formula({ ...safe, melaena: true })).toBe(1);
    expect(formula({ ...safe, syncope: true })).toBe(2);
  });
});
