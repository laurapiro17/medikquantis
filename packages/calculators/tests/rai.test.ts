import { describe, expect, it } from "vitest";
import { calculator, formula, interpret, type RaiInput } from "../src/rai";

const lymphocytosisOnly: RaiInput = {
  lymphadenopathy: false,
  organomegaly: false,
  anaemia: false,
  thrombocytopenia: false,
};

describe("rai calculator", () => {
  it("assigns the highest stage whose finding is present", () => {
    expect(formula(lymphocytosisOnly)).toBe(0);
    expect(formula({ ...lymphocytosisOnly, lymphadenopathy: true })).toBe(1);
    expect(formula({ ...lymphocytosisOnly, organomegaly: true })).toBe(2);
    expect(formula({ ...lymphocytosisOnly, lymphadenopathy: true, organomegaly: true })).toBe(2);
    expect(formula({ ...lymphocytosisOnly, anaemia: true })).toBe(3);
    expect(formula({ lymphadenopathy: true, organomegaly: true, anaemia: true, thrombocytopenia: false })).toBe(3);
    expect(formula({ ...lymphocytosisOnly, thrombocytopenia: true })).toBe(4);
    expect(formula({ ...lymphocytosisOnly, anaemia: true, thrombocytopenia: true })).toBe(4);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 4 });
  });

  it.each([
    [0, "low", "RAI_0"],
    [1, "moderate", "RAI_I"],
    [2, "moderate", "RAI_II"],
    [3, "high", "RAI_III"],
    [4, "high", "RAI_IV"],
  ])("maps stage %i onto the modified three-risk tier %s (%s)", (stage, tier, code) => {
    expect(interpret(stage).tier).toBe(tier);
    expect(interpret(stage).recommendationCode).toBe(code);
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("rai");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("1139039");
  });
});
