import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/braden";

describe("Braden Scale", () => {
  it("sums to 23 at all max values", () => {
    expect(
      formula({
        sensoryPerception: "4",
        moisture: "4",
        activity: "4",
        mobility: "4",
        nutrition: "4",
        frictionAndShear: "3",
      }),
    ).toBe(23);
  });

  it("sums to 6 at all min values", () => {
    expect(
      formula({
        sensoryPerception: "1",
        moisture: "1",
        activity: "1",
        mobility: "1",
        nutrition: "1",
        frictionAndShear: "1",
      }),
    ).toBe(6);
  });

  it("classifies risk per Bergstrom cut-offs", () => {
    expect(interpret(22).recommendationCode).toBe("BRADEN_NO_RISK");
    expect(interpret(16).recommendationCode).toBe("BRADEN_MILD");
    expect(interpret(13).recommendationCode).toBe("BRADEN_MODERATE");
    expect(interpret(11).recommendationCode).toBe("BRADEN_HIGH");
    expect(interpret(8).recommendationCode).toBe("BRADEN_VERY_HIGH");
  });
});
