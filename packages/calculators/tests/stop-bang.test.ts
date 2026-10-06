import { describe, expect, it } from "vitest";
import { calculator, formula, interpret } from "../src/stop-bang";

const NONE = {
  snoring: false,
  tired: false,
  observedApnoea: false,
  highBloodPressure: false,
  bmiOver35: false,
  ageOver50: false,
  neckOver40cm: false,
  male: false,
};

describe("stop-bang calculator", () => {
  it("scores no risk factors as zero and low risk", () => {
    const score = formula(NONE);
    expect(score).toBe(0);
    expect(interpret(score).tier).toBe("low");
    expect(interpret(score).recommendationCode).toBe("STOPBANG_LOW");
  });

  it("reaches the documented maximum of 8", () => {
    const all = Object.fromEntries(
      Object.keys(NONE).map((k) => [k, true]),
    ) as typeof NONE;
    expect(formula(all)).toBe(8);
    expect(calculator.scoreRange).toEqual({ min: 0, max: 8 });
  });

  it("pins both tier boundaries", () => {
    expect(interpret(2).recommendationCode).toBe("STOPBANG_LOW");
    expect(interpret(3).recommendationCode).toBe("STOPBANG_INTERMEDIATE");
    expect(interpret(4).recommendationCode).toBe("STOPBANG_INTERMEDIATE");
    expect(interpret(5).recommendationCode).toBe("STOPBANG_HIGH");
    expect(interpret(5).tier).toBe("high");
  });

  it("counts each item as exactly one point", () => {
    expect(formula({ ...NONE, snoring: true })).toBe(1);
    expect(formula({ ...NONE, male: true })).toBe(1);
    expect(formula({ ...NONE, snoring: true, male: true })).toBe(2);
  });

  it("matches definition metadata", () => {
    expect(calculator.id).toBe("stop-bang");
    expect(calculator.specialty).toBe("otorhinolaryngology");
    expect(calculator.references[0].pmid).toBe("18431116");
  });
});
