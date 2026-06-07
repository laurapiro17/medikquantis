import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/fena";

describe("FENa", () => {
  it("computes the canonical formula", () => {
    // UNa 20 · PCr 2 / (PNa 140 · UCr 100) · 100 ≈ 0.29 %
    expect(
      formula({
        urineSodiumMEqL: 20,
        plasmaSodiumMEqL: 140,
        urineCreatinineMgDl: 100,
        plasmaCreatinineMgDl: 2,
      }),
    ).toBeCloseTo(0.29, 1);
  });

  it("places < 1 % prerenal, 1–2 % indeterminate, > 2 % intrinsic", () => {
    expect(interpret(0.4).category).toBe("prerenal");
    expect(interpret(1.5).category).toBe("indeterminate");
    expect(interpret(3.2).category).toBe("intrinsic");
  });

  it("exposes the canonical recommendation codes", () => {
    expect(interpret(0.4).recommendationCode).toBe("FENA_PRERENAL");
    expect(interpret(1.5).recommendationCode).toBe("FENA_INDETERMINATE");
    expect(interpret(3.2).recommendationCode).toBe("FENA_INTRINSIC");
  });
});
