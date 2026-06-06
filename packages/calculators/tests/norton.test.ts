import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/norton";

describe("Norton Scale", () => {
  it("sums each subscale 1-4", () => {
    expect(
      formula({
        physicalCondition: "4",
        mentalCondition: "4",
        activity: "4",
        mobility: "4",
        incontinence: "4",
      }),
    ).toBe(20);
    expect(
      formula({
        physicalCondition: "1",
        mentalCondition: "1",
        activity: "1",
        mobility: "1",
        incontinence: "1",
      }),
    ).toBe(5);
  });

  it("places ≥18 low, 14–17 moderate, ≤13 high", () => {
    expect(interpret(20).tier).toBe("low");
    expect(interpret(18).tier).toBe("low");
    expect(interpret(15).tier).toBe("moderate");
    expect(interpret(13).tier).toBe("high");
    expect(interpret(5).recommendationCode).toBe("NORTON_HIGH");
  });
});
