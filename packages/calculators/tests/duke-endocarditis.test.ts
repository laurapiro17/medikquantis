import { describe, expect, it } from "vitest";
import { formula, interpret } from "../src/duke-endocarditis";

const empty = {
  majorBloodCultures: false,
  majorEndocardialInvolvement: false,
  minorPredisposition: false,
  minorFever: false,
  minorVascularPhenomena: false,
  minorImmunologicPhenomena: false,
  minorMicrobiologicEvidence: false,
};

describe("Modified Duke criteria", () => {
  it("rejects endocarditis when no criteria are met", () => {
    const result = interpret(formula(empty));
    expect(result.category).toBe("rejected");
  });

  it("calls it definite with 2 major", () => {
    const score = formula({
      ...empty,
      majorBloodCultures: true,
      majorEndocardialInvolvement: true,
    });
    expect(interpret(score).category).toBe("definite");
  });

  it("calls it definite with 1 major + 3 minor", () => {
    const score = formula({
      ...empty,
      majorBloodCultures: true,
      minorPredisposition: true,
      minorFever: true,
      minorVascularPhenomena: true,
    });
    expect(interpret(score).category).toBe("definite");
  });

  it("calls it definite with 5 minor", () => {
    const score = formula({
      ...empty,
      minorPredisposition: true,
      minorFever: true,
      minorVascularPhenomena: true,
      minorImmunologicPhenomena: true,
      minorMicrobiologicEvidence: true,
    });
    expect(interpret(score).category).toBe("definite");
  });

  it("calls it possible with 1 major + 1 minor", () => {
    const score = formula({
      ...empty,
      majorBloodCultures: true,
      minorFever: true,
    });
    expect(interpret(score).category).toBe("possible");
  });

  it("calls it possible with 3 minor", () => {
    const score = formula({
      ...empty,
      minorPredisposition: true,
      minorFever: true,
      minorVascularPhenomena: true,
    });
    expect(interpret(score).category).toBe("possible");
  });

  it("exposes major and minor counts in the interpretation", () => {
    const score = formula({
      ...empty,
      majorBloodCultures: true,
      minorFever: true,
      minorVascularPhenomena: true,
    });
    const r = interpret(score);
    expect(r.majorCount).toBe(1);
    expect(r.minorCount).toBe(2);
  });
});
