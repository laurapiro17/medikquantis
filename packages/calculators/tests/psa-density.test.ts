import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/psa-density";

describe("PSA density (Benson 1992)", () => {
  it("divides PSA by prostate volume", () => {
    // 6 ng/mL / 40 mL = 0.15
    expect(formula({ psaNgMl: 6, prostateVolumeMl: 40 })).toBe(0.15);
    // 8 / 50 = 0.16
    expect(formula({ psaNgMl: 8, prostateVolumeMl: 50 })).toBe(0.16);
  });

  it("flags ≥ 0.15 as elevated", () => {
    expect(interpret(0.15).tier).toBe("high");
    expect(interpret(0.20).tier).toBe("high");
    expect(interpret(0.15).recommendationCode).toBe("PSA_DENS_ELEVATED");
  });

  it("flags < 0.15 as low", () => {
    expect(interpret(0.10).tier).toBe("low");
    expect(interpret(0.14).recommendationCode).toBe("PSA_DENS_LOW");
  });
});
