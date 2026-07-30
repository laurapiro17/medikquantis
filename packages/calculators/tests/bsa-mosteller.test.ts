import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/bsa-mosteller";

describe("BSA Mosteller Formula", () => {
  it("calculates BSA accurately", () => {
    // 175 cm, 70 kg -> sqrt((175 * 70) / 3600) = sqrt(12250 / 3600) = sqrt(3.40277) = 1.8446 -> 1.84
    expect(formula({ height: 175, weight: 70 })).toBe(1.84);
  });

  it("classifies adult average BSA", () => {
    const res = interpret(1.84);
    expect(res.tier).toBe("low");
    expect(res.recommendationCode).toBe("BSA_NORMAL");
  });

  it("classifies pediatric / small BSA", () => {
    const res = interpret(1.1);
    expect(res.tier).toBe("low");
    expect(res.recommendationCode).toBe("BSA_LOW");
  });

  it("classifies large BSA", () => {
    const res = interpret(2.4);
    expect(res.tier).toBe("moderate");
    expect(res.recommendationCode).toBe("BSA_HIGH");
  });
});
