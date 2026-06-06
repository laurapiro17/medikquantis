import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/calcium-corrected";

describe("Albumin-corrected calcium (Payne 1973)", () => {
  it("returns measured calcium when albumin is exactly 4.0", () => {
    expect(formula({ calciumMgDl: 9.0, albuminGDl: 4.0 })).toBe(9.0);
  });

  it("adds 0.8 mg/dL per 1 g/dL of albumin below 4.0", () => {
    // Ca 8.0 + 0.8·(4-2) = 9.6
    expect(formula({ calciumMgDl: 8.0, albuminGDl: 2.0 })).toBe(9.6);
  });

  it("subtracts 0.8 mg/dL per 1 g/dL of albumin above 4.0", () => {
    // Ca 9.5 + 0.8·(4-5) = 8.7
    expect(formula({ calciumMgDl: 9.5, albuminGDl: 5.0 })).toBe(8.7);
  });

  it("classifies < 8.5 as hypocalcaemia", () => {
    expect(interpret(8.0).category).toBe("hypocalcaemia");
    expect(interpret(8.0).recommendationCode).toBe("CA_CORR_HYPO");
  });

  it("classifies 8.5–10.5 as normal", () => {
    expect(interpret(9.0).category).toBe("normal");
    expect(interpret(8.5).category).toBe("normal");
    expect(interpret(10.5).category).toBe("normal");
  });

  it("classifies > 10.5 as hypercalcaemia", () => {
    expect(interpret(11.0).category).toBe("hypercalcaemia");
    expect(interpret(11.0).recommendationCode).toBe("CA_CORR_HYPER");
  });
});
