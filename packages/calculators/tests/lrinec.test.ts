import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/lrinec";

const normal = {
  crpMgDl: 5,
  wbcPerMm3: 10000,
  hemoglobinGDl: 14,
  sodiumMEqL: 138,
  creatinineMgDl: 1.0,
  glucoseMgDl: 100,
};

describe("LRINEC (Wong 2004)", () => {
  it("scores 0 with all values in normal range", () => {
    expect(formula(normal)).toBe(0);
  });

  it("scores 4 for CRP ≥ 15 mg/dL", () => {
    expect(formula({ ...normal, crpMgDl: 20 })).toBe(4);
  });

  it("scores 1 for WBC 15-25k and 2 for >25k", () => {
    expect(formula({ ...normal, wbcPerMm3: 20000 })).toBe(1);
    expect(formula({ ...normal, wbcPerMm3: 30000 })).toBe(2);
  });

  it("scores 2 for severe anaemia (Hb<11)", () => {
    expect(formula({ ...normal, hemoglobinGDl: 10 })).toBe(2);
  });

  it("places ≤5 in low, 6-7 intermediate, ≥8 high", () => {
    expect(interpret(5).tier).toBe("low");
    expect(interpret(7).tier).toBe("moderate");
    expect(interpret(8).tier).toBe("high");
    expect(interpret(13).recommendationCode).toBe("LRINEC_HIGH");
  });
});
