import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/centor";

describe("Centor / McIsaac", () => {
  it("applies +1 for child, 0 for adult, -1 for older adult", () => {
    const base = {
      tonsillarExudate: false,
      tenderAnteriorCervicalNodes: false,
      feverHistory: false,
      absenceOfCough: false,
    };
    expect(formula({ ...base, ageBand: "lt_15" })).toBe(1);
    expect(formula({ ...base, ageBand: "15_to_44" })).toBe(0);
    expect(formula({ ...base, ageBand: "gte_45" })).toBe(-1);
  });

  it("maxes at 5 (4 clinical + 1 paediatric)", () => {
    expect(
      formula({
        tonsillarExudate: true,
        tenderAnteriorCervicalNodes: true,
        feverHistory: true,
        absenceOfCough: true,
        ageBand: "lt_15",
      }),
    ).toBe(5);
  });

  it("places ≤1 in low (no test, no antibiotics)", () => {
    expect(interpret(-1).tier).toBe("low");
    expect(interpret(0).tier).toBe("low");
    expect(interpret(1).tier).toBe("low");
    expect(interpret(1).recommendationCode).toBe("CENTOR_LOW_NO_TEST");
  });

  it("places 2-3 in moderate (RADT)", () => {
    expect(interpret(2).tier).toBe("moderate");
    expect(interpret(3).recommendationCode).toBe("CENTOR_MODERATE_RADT");
  });

  it("places 4-5 in high (treat)", () => {
    expect(interpret(4).tier).toBe("high");
    expect(interpret(5).recommendationCode).toBe("CENTOR_HIGH_TREAT");
  });
});
