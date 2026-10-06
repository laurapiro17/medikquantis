import { describe, expect, it } from "vitest";
import { calculator, formula, interpret, IssInputs } from "../src/iss";

describe("iss calculator", () => {
  it.each([
    // [β2-microglobulin mg/L, albumin g/dL, stage]
    [3.4, 3.5, 1],
    [2.0, 4.5, 1],
    [3.4, 3.4, 2], // low albumin keeps it out of stage I
    [3.5, 4.0, 2], // β2M at 3.5 is no longer stage I
    [5.4, 4.0, 2],
    [5.5, 4.0, 3], // stage III starts at β2M ≥ 5.5 whatever the albumin
    [8.0, 2.8, 3],
  ])("β2M %f mg/L with albumin %f g/dL is stage %i", (beta2Microglobulin, albumin, stage) => {
    expect(formula({ beta2Microglobulin, albumin })).toBe(stage);
  });

  it.each([
    [1, "low", "ISS_I"],
    [2, "moderate", "ISS_II"],
    [3, "high", "ISS_III"],
  ])("maps stage %i onto %s (%s)", (stage, tier, code) => {
    expect(interpret(stage).tier).toBe(tier);
    expect(interpret(stage).recommendationCode).toBe(code);
  });

  it("rejects non-positive and implausible values", () => {
    for (const invalid of [
      { beta2Microglobulin: 0, albumin: 4 },
      { beta2Microglobulin: -1, albumin: 4 },
      { beta2Microglobulin: 3, albumin: 0 },
      { beta2Microglobulin: 3, albumin: 35 }, // g/L entered instead of g/dL
      { beta2Microglobulin: 3 },
    ]) {
      expect(IssInputs.safeParse(invalid).success).toBe(false);
    }
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("iss");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("15809451");
    expect(calculator.scoreRange).toEqual({ min: 1, max: 3 });
  });
});
