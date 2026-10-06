import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/snot-22";

const FIELDS = [
  "needToBlowNose",
  "nasalObstruction",
  "sneezing",
  "runnyNose",
  "cough",
  "postNasalDischarge",
  "thickNasalDischarge",
  "earFullness",
  "dizziness",
  "earPain",
  "facialPainOrPressure",
  "lossOfSmellOrTaste",
  "difficultyFallingAsleep",
  "wakingUpAtNight",
  "lackOfGoodNightsSleep",
  "wakingUpTired",
  "fatigueDuringTheDay",
  "reducedProductivity",
  "reducedConcentration",
  "frustratedRestlessOrIrritable",
  "sad",
  "embarrassed",
] as const;

const all = (v: "0" | "1" | "2" | "3" | "4" | "5") =>
  Object.fromEntries(FIELDS.map((f) => [f, v])) as Record<
    (typeof FIELDS)[number],
    "0" | "1" | "2" | "3" | "4" | "5"
  >;

describe("snot-22 calculator", () => {
  it("scores all-zero as zero and low", () => {
    expect(formula(all("0"))).toBe(0);
    expect(interpret(0).tier).toBe("low");
    expect(interpret(0).recommendationCode).toBe("SNOT22_MILD");
  });

  it("reaches the documented maximum of 110", () => {
    expect(formula(all("5"))).toBe(110);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 110 });
  });

  it("has twenty-two items", () => {
    expect(FIELDS).toHaveLength(22);
    expect(Object.keys(calculator.fieldsMetadata ?? {})).toHaveLength(22);
    expect(Object.keys(calculator.inputs.shape)).toHaveLength(22);
  });

  it("keeps the published questionnaire item order", () => {
    expect(Object.keys(calculator.fieldsMetadata ?? {})).toEqual(FIELDS);
    expect(Object.keys(calculator.inputs.shape)).toEqual(FIELDS);
  });

  it("pins every tier boundary", () => {
    expect(interpret(0).recommendationCode).toBe("SNOT22_MILD");
    expect(interpret(20).recommendationCode).toBe("SNOT22_MILD");
    expect(interpret(20).tier).toBe("low");
    expect(interpret(21).recommendationCode).toBe("SNOT22_MODERATE");
    expect(interpret(50).recommendationCode).toBe("SNOT22_MODERATE");
    expect(interpret(50).tier).toBe("moderate");
    expect(interpret(51).recommendationCode).toBe("SNOT22_SEVERE");
    expect(interpret(51).tier).toBe("high");
    expect(interpret(110).recommendationCode).toBe("SNOT22_SEVERE");
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("snot-22");
    expect(calculator.specialty).toBe("otorhinolaryngology");
    expect(calculator.references[0].pmid).toBe("19793277");
    expect(calculator.references[1].pmid).toBe("27017484");
  });
});
