import { describe, expect, it } from "vitest";
import { calculator, formula, interpret, type RIssInput } from "../src/r-iss";

const issI = { beta2Microglobulin: 2.5, albumin: 4.0 };
const issII = { beta2Microglobulin: 4.0, albumin: 4.0 };
const issIII = { beta2Microglobulin: 7.0, albumin: 3.0 };
const standard = { highRiskCytogenetics: false, ldhHigh: false };

describe("r-iss calculator", () => {
  it.each<[string, RIssInput, number]>([
    ["ISS I, standard-risk CA, normal LDH", { ...issI, ...standard }, 1],
    ["ISS I with high LDH", { ...issI, ...standard, ldhHigh: true }, 2],
    ["ISS I with high-risk CA", { ...issI, ...standard, highRiskCytogenetics: true }, 2],
    ["ISS II even with every adverse feature", { ...issII, highRiskCytogenetics: true, ldhHigh: true }, 2],
    ["ISS II with standard risk", { ...issII, ...standard }, 2],
    ["ISS III without high-risk CA or high LDH", { ...issIII, ...standard }, 2],
    ["ISS III with high-risk CA", { ...issIII, ...standard, highRiskCytogenetics: true }, 3],
    ["ISS III with high LDH", { ...issIII, ...standard, ldhHigh: true }, 3],
  ])("%s is R-ISS %i", (_label, inputs, stage) => {
    expect(formula(inputs)).toBe(stage);
  });

  it.each([
    [1, "low", "RISS_I"],
    [2, "moderate", "RISS_II"],
    [3, "high", "RISS_III"],
  ])("maps stage %i onto %s (%s)", (stage, tier, code) => {
    expect(interpret(stage).tier).toBe(tier);
    expect(interpret(stage).recommendationCode).toBe(code);
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("r-iss");
    expect(calculator.specialty).toBe("hematology");
    expect(calculator.references[0].pmid).toBe("26240224");
    expect(calculator.scoreRange).toEqual({ min: 1, max: 3 });
  });
});
